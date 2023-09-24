import TelegramBot from "node-telegram-bot-api";
import { MongoClient } from "mongodb";

export const startCommand = async (
  msg: TelegramBot.Message,
  address: string,
  bot: TelegramBot,
  alarmDB: MongoClient
) => {
  await alarmDB.db("alarm").collection("user").insertOne({
    ownerAddress: address,
    chatId: msg.chat.id,
  });
};
