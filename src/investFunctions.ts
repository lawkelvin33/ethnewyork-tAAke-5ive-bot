import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";

export const investAlarm = async (
  walletDB: MongoClient,
  bot: TelegramBot
) => {};

export const updateInvests = async (
  mainDB: MongoClient,
  walletDB: MongoClient
) => {};
