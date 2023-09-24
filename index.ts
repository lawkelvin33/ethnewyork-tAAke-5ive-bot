import TelegramBot from "node-telegram-bot-api";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MongoClient } from "mongodb";
import { Lambda } from "aws-sdk";
import { isAddress } from "ethers";

// commands
import { investAlarm } from "./src/investFunctions";
import { updateInvests } from "./src/investFunctions";

// Telegram Bot
const token = String(process.env.TELEGRAM_BOT_KEY);
const bot = new TelegramBot(token);

let globalResolve: (value: any) => void = () => {};

// DB Connection
const mainDB = new MongoClient(String(process.env.MONGO_DB_KEY));
const walletDB = new MongoClient(String(process.env.MONGO_DB_TEST));

const lambda = new Lambda({
  apiVersion: "2015-03-31",

  endpoint: process.env.IS_OFFLINE
    ? "http://localhost:3000"
    : "https://f1oaxo1rn2.execute-api.us-east-1.amazonaws.com/dev/webhook",
});

export const rebalanceAlarm = async () => {
  // 1. get alarm info from DB
  // 2. update position info of invests that have alarms
  // 3. send alarm to users
  await investAlarm(walletDB, bot);
};

export const updateInvests = async () => {
  // update investment information whose notification is set as true
  await investUpdate(mainDB, walletDB);
};

export const webhook = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const bodyParsed = JSON.parse(event.body!);
    console.log("bodyParsed", bodyParsed);
    await new Promise((resolve, reject) => {
      globalResolve = resolve;
      bot.processUpdate(bodyParsed);
      // set timeout to 3 seconds to resolve the promise in case the bot doesn't respond
      setTimeout(() => {
        // make sure to resolve the promise in case of timeout as well
        // do not reject the promise, otherwise the lambda will be marked as failed
        resolve("global timeout");
      }, 10000);
    });

    // respond to Telegram that the webhook has been received.
    // if this is not sent, telegram will try to resend the webhook over and over again.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "function executed successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "function executed with error" }),
    };
  }
};

bot.onText(
  /\/start/,
  async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
    await startCommand(msg, bot);
    globalResolve("ok");
  }
);

bot.onText(
  /\/echo (.+)/,
  async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
    await echo(msg, match, bot);
    globalResolve("ok");
  }
);
