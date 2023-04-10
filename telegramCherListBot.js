const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = '6021086571:AAHSmcPEo9TY51ru60wQE89yClu03sowJYs';
const bot = new TelegramBot(token, { polling: true });

const characterDataFilePath = path.join(__dirname, 'D&D/MainBlock/charDescrip_data.json');

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

bot.onText(/Дополнительные действия|Назад/, (msg) => {
  if (msg.text === 'Назад') {
    bot.sendMessage(msg.chat.id, "Выберите действие", {
      reply_markup: {
        keyboard: [
          [{ text: "Дополнительные действия" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  } else {
    bot.sendMessage(msg.chat.id, "Выберите одно из дополнительных действий", {
      reply_markup: {
        keyboard: [
          [{ text: "Описание персонажа" }, { text: "Действие 2" }, { text: "Назад" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  }
});

bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;

  if (action === 'editName' || action === 'editRace') {
    const fieldName = action === 'editName' ? 'name' : 'race';

    bot.answerCallbackQuery(callbackQuery.id);

    bot.sendMessage(callbackQuery.message.chat.id, `Введите новое значение для ${fieldName}`);

    bot.once('message', (newDataMessage) => {
      const characterData = JSON.parse(fs.readFileSync(characterDataFilePath, 'utf8'));
      characterData[fieldName] = newDataMessage.text;

      fs.writeFileSync(characterDataFilePath, JSON.stringify(characterData), 'utf8');

      bot.sendMessage(callbackQuery.message.chat.id, `Успешно обновлено`);

      const inlineKeyboard = [
        [
          { text: 'Редактировать имя', callback_data: 'editName' },
          { text: 'Редактировать расу', callback_data: 'editRace' },
        ],
      ];

      bot.sendMessage(callbackQuery.message.chat.id, `Имя: ${characterData.name}\nРаса: ${characterData.race}`, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });

    });
  }
});

bot.onText(/Действие 2/, (msg) => {
  bot.sendMessage(msg.chat.id, "Это действие ещё в разработке");
});


bot.onText(/Описание персонажа/, (msg) => {
  const characterData = JSON.parse(fs.readFileSync(characterDataFilePath, 'utf8'));

  const inlineKeyboard = [
    [
      { text: 'Редактировать имя', callback_data: 'editName' },
      { text: 'Редактировать расу', callback_data: 'editRace' },
    ],
  ];

  bot.sendMessage(msg.chat.id, `Имя: ${characterData.name}\nРаса: ${characterData.race}`, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
});
