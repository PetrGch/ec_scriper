import telegramBot from "./telegramBot";
import properties from "../properties";

export function telegramServerBot(bot, id) {
  bot.onText(/echo (.+)/, (msg, match) => {
    const userId = msg.from.id;
    const text = match[1];

    if (parseInt(id, 10) === parseInt(userId, 10)) {
      bot.sendMessage(userId, text);
    } else {
      bot.sendMessage(userId, "Sorry! I don't know you! o_O");
    }
  });

}

export function telegramLogger(text) {
  telegramBot.bot().sendMessage(properties.MY_TELEGRAM_ID, text);
}


// bot.onText(/remind (.+) at (.+)/, (msg, match) => {
//   const userId = msg.from.id;
//   const text = match[1];
//   const time = match[2];
//
//   notes.push({ 'uid': userId, 'time': time, 'text': text });
//
//   bot.sendMessage(userId, 'Ok! I\'ll do it if would not die :)');
// });

// setInterval(() => {
//   for (let i = 0; i < notes.length; i++){
//     const curDate = new Date().getHours() + ':' + new Date().getMinutes();
//     console.log(curDate, notes[i]['time'])
//     if (notes[i]['time'] == curDate ) {
//       bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
//       notes.splice(i,1);
//     }
//   }
// }, 1000);
