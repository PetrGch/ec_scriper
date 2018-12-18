import TelegramBot from "node-telegram-bot-api";
import properties from "../properties";

import {telegramServerBot} from "./telegramServerBot";

const telegramBot = (function () {
  let instance = new TelegramBot(properties.TELEGRAM_BOT, {polling: true});

  telegramServerBot(instance, properties.MY_TELEGRAM_ID);

  return {
    bot() {
      return instance;
    },
  }
})();


export default telegramBot;
