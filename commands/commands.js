const { getWeather } = require("../utils/utils");

const subscribers = new Map();

const helpMessage = `
*Welcome to the Weather Bot!*

Commands:
/userinfo - find user info like- userId, name
/subscribe - Subscribe to receive weather updates
/unsubscribe - Unsubscribe from weather updates
/setcity - Update your city for weather updates
/admin - (Admins only) Access the admin panel
`;

module.exports = {
  handleStart: (bot, msg) => {
    bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: "Markdown" });
  },

  handleUserInfo: (bot, msg) => {
    const chatId = msg.chat.id;
    const Name = `${msg.chat.first_name} ${msg.chat.last_name}`;
    bot.sendMessage(
      chatId,
      `Your ID:${chatId} \nName: ${Name}`,
      { parse_mode: "Markdown" }
    );
  },

  handleSubscribe: async (bot, msg) => {
    const chatId = msg.chat.id;
    const name = `${msg.chat.first_name} ${msg.chat.last_name}`;
    bot.sendMessage(chatId, "Enter your city for weather updates:");

    bot.once("message", async (response) => {
      const city = response.text.trim();
      subscribers.set(chatId, {
        subscribed: true,
        city,
        name,
      });

      try {
        // Fetch weather immediately after subscribing
        const weather = await getWeather(city);
        if (weather && weather.weather && weather.main) {
          const message = `*Weather in ${weather.name}:*\nCloud: ${weather.weather[0].description} \nTemp: ${weather.main.temp}°C`;
          bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
        } else {
          bot.sendMessage(
            chatId,
            `Could not fetch weather data for *${city}*.`
          );
        }
      } catch (error) {
        bot.sendMessage(
          chatId,
          `Error fetching weather for *${city}*: ${error.message}`
        );
      }

      bot.sendMessage(chatId, `Subscribed to weather updates for *${city}*!`, {
        parse_mode: "Markdown",
      });
    });
  },

  handleUnsubscribe: (bot, msg) => {
    const chatId = msg.chat.id;
    subscribers.delete(chatId);
    bot.sendMessage(chatId, "Unsubscribed from weather updates.");
  },

  handleSetCity: (bot, msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Enter your new city:");

    bot.once("message", (response) => {
      const city = response.text.trim();
      if (subscribers.has(chatId)) {
        subscribers.get(chatId).city = city;
        bot.sendMessage(chatId, `City updated to *${city}*`, {
          parse_mode: "Markdown",
        });
      } else {
        bot.sendMessage(chatId, "Not subscribed. Use /subscribe first.");
      }
    });
  },

  subscribers,
};
