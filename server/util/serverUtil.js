import {telegramLogger} from "../bot/telegramServerBot";

export function responseWrapper(res, code, message) {
  if (message) {
    telegramLogger(message);
  }

  res.status(code).send(message);
}