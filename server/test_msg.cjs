const { Bot } = require('node-telegram-bot-api');
const bot = new Bot('8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0');
bot.on('message', (msg) => {
  console.log('MSG OBJECT:', JSON.stringify(msg, null, 2));
  console.log('MSG TEXT:', msg.text);
});
console.log('Test bot running...');
