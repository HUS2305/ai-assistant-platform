import TelegramBot from "node-telegram-bot-api";

export type TelegramConfig = {
  botToken: string;
  polling?: boolean;
};

export const createTelegramBot = (config: TelegramConfig) => {
  if (!config.botToken) {
    throw new Error("Telegram bot token is required");
  }

  const bot = new TelegramBot(config.botToken, {
    polling: config.polling ?? false
  });

  return bot;
};

