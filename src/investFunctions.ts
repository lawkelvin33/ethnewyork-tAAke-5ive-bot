import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";

export const investAlarm = async (alarmDB: MongoClient, bot: TelegramBot) => {};

export const investUpdate = async (alarmDB: MongoClient) => {
  const invests = await alarmDB
    .db("alarm")
    .collection("invests")
    .find()
    .toArray();
};
