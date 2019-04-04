import TelegramBot from "node-telegram-bot-api";
import properties from "../properties";

import {telegramServerBot} from "./telegramServerBot";

let telegramBot = null;

(function () {
  if (telegramBot) {
    return;
  }

  let instance = new TelegramBot(properties.TELEGRAM_BOT);

  telegramServerBot(instance, properties.MY_TELEGRAM_ID);

  telegramBot = {
    bot() {
      return instance;
    },
  }
})();


export default telegramBot;
