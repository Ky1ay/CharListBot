const TelegramBot = require('node-telegram-bot-api');
const description = require('./D&D/MainBlock/characterDescription');

// Токен вашего бота
const token = '5911525581:AAGR8QB3g-YCV7Ca1PNtcdazcMHOxwo_O20';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Выберите действие", {
    reply_markup: {
      keyboard: [
        [{ text: "Дополнительные действия" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Обработчик кнопки "Дополнительные действия"
bot.onText(/Дополнительные действия/, (msg) => {
  bot.sendMessage(msg.chat.id, "Выберите одно из дополнительных действий", {
    reply_markup: {
      keyboard: [
        [{ text: "Описание персонажа" }, { text: "Действие 2" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Обработчик кнопки "Описание персонажа"
bot.onText(/Описание персонажа/, (msg) => {
  description.handleDescription(bot, msg);
});

