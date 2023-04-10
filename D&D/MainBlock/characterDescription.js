const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Токен вашего бота
const token = '5911525581:AAGR8QB3g-YCV7Ca1PNtcdazcMHOxwo_O20';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик кнопки "Описание персонажа"
bot.onText(/Описание персонажа/, (msg) => {
  // Читаем данные из файла
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync('MainBlockJSON/charDescrip_data.json'));
  } catch (err) {
    console.error(err);
  }

  // Создаем объект с полями для редактирования
  const fields = {};
  fields['name'] = data.name || '';
  fields['race'] = data.race || '';

  // Формируем сообщение с полями для редактирования
  let message = 'Редактирование описания персонажа:\n\n';
  for (let key in fields) {
    message += `${key}: ${fields[key]}\n`;
  }
  message += '\nВведите новые значения (одной строкой через запятую):';

  // Отправляем сообщение с инлайн-клавиатурой
  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Сохранить", callback_data: "save" }]
      ]
    }
  })
    .then(() => {
      // Ожидаем ответа от пользователя
      bot.once('message', (reply) => {
        // Обрабатываем ответ
        const values = reply.text.split(',');
        for (let i = 0; i < values.length; i++) {
          const key = Object.keys(fields)[i];
          fields[key] = values[i].trim();
        }
        // Сохраняем данные в файл
        fs.writeFileSync('MainBlockJSON/charDescrip_data.json', JSON.stringify(fields));
        // Отправляем подтверждение
        bot.sendMessage(msg.chat.id, 'Данные сохранены');
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

