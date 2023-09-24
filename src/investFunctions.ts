import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { syncBlockQuery } from "./thegraph/base.graph";
import { investsInterface } from "./interface/interfaces.interface";
import { investQuery, poolQuery } from "./thegraph/query.graph";

export const investAlarm = async (alarmDB: MongoClient, bot: TelegramBot) => {
  const invests = await alarmDB
    .db("alarm")
    .collection("invests")
    .find({ notification: true })
    .toArray();

  const messages = [];

  invests.forEach((i) => {
    if (i.currentPrice < i.range[0] || i.currentPrice > i.range[1]) {
      const currentValue =
        i.inputTokensAmount[0] * i.inputTokensPrice[0] +
        i.inputTokensAmount[1] * i.inputTokensPrice[1];
      const feesValue =
        i.accumulatedFees[0] * i.inputTokensPrice[0] +
        i.accumulatedFees[1] * i.inputTokensPrice[1];
      const totalValue = currentValue + feesValue;
      const valueChange = 100 * (totalValue / i.initialValue - 1);
      const message = `${valueChange > 0 ? "📈" : "📉"} Rebelancing Needed!${
        i.inputTokens[0]
      }+${i.inputTokens[1]}\n\nCurrent Value: ${totalValue} ( ${
        valueChange > 0 ? "+" : "-"
      }${valueChange}% )
      \nfee: ${feesValue}
      \nCurrent Price: $${i.currentPrice}
      \nRange: [ ${i.range[0]} : ${i.range[1]} ]
      \nCurrent APR: ${i.currentAPR}%
      \n${(
        +(i.lastUpdatedTime.getTime() - i.createdAt.getTime()) /
        1000 /
        60 /
        60
      ).toFixed(1)}
      `;
      return bot.sendMessage(i.chatId, message, { parse_mode: "HTML" });
    }
  });
};

export const investUpdate = async (alarmDB: MongoClient) => {
  const _invests = await alarmDB
    .db("alarm")
    .collection("invests")
    .find()
    .toArray();

  const invests: investsInterface[] = _invests.map((i) => {
    return {
      id: i.id,
      chatId: i.chatId,
      subgraph: i.subgraph,
      projectId: i.projectId,
      createdAt: i.createdAt,
      positionId: i.positionId,
      ownerAddress: i.ownerAddress,
      poolAddress: i.poolAddress,
      chainId: i.chainId,
      project: i.project,
      positionManager: i.positionManager,
      masterChef: i.masterChef,
      toaster: i.toaster,
      initialValue: i.initialValue,
      notification: i.notification,
      lastUpdatedTime: i.lastUpdatedTime,
      inputTokens: i.inputTokens, // symbol
      inputTokensAmount: i.inputTokensAmount,
      inputTokensPrice: i.inputTokensPrice,
      accumulatedFees: i.accumulatedFees,
      range: i.range,
      currentPrice: i.currentPrice,
      currentAPR: i.currentAPR,
    };
  });

  const investByChain: Map<number, investsInterface[]> = new Map<
    number,
    investsInterface[]
  >();

  invests.forEach((i) => {
    investByChain.get(i.chainId) !== undefined
      ? //@ts-ignore
        investByChain.set(i.chainId, [...investByChain.get(i.chainId), i])
      : investByChain.set(i.chainId, [i]);
  });

  for (const c of investByChain) {
    const _meta = await syncBlockQuery(c[1][0].subgraph);
    const invests = await Promise.all(
      c[1].flatMap((i) => [
        investQuery(i.subgraph, _meta!.blockNumber, i.positionId),
        poolQuery(i.subgraph, _meta!.blockNumber, i.poolAddress),
      ])
    );

    const dbUpdate = [];

    for (let i = 0; i < invests.length; i += 2) {
      const position = invests[i];
      const pool = invests[i + 1];
      const update = alarmDB
        .db("alarm")
        .collection("invests")
        .updateOne(
          { id: c[1][i / 2].id },
          {
            $set: {
              inputTokensAmount: [
                //@ts-ignore
                position.depositedToken0,
                //@ts-ignore
                position.depositedToken1,
              ],
              accumulatedFees: [
                //@ts-ignore
                position.collectedFeesToken0,
                //@ts-ignore
                position.collectedFeesToken1,
              ],
              //@ts-ignore
              currentPrice: pool.token0Price,
              notification:
                //@ts-ignore
                position.depositedToken0 + position.depositedToken1 > 0
                  ? true
                  : false,
            },
          }
        );
      dbUpdate.push(update);
    }
    await Promise.all(dbUpdate);
  }
};
