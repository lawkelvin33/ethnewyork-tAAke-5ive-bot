import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { syncBlockQuery } from "./thegraph/base.graph";
import { investsInterface } from "./interface/interfaces.interface";

export const investAlarm = async (alarmDB: MongoClient, bot: TelegramBot) => {};

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
    const _meta = syncBlockQuery(c[1][0].subgraph);
    await Promise.all(c[1].map((i) => {}));
  }
};
