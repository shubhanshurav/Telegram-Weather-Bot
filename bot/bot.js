const TelegramBot = require("node-telegram-bot-api");
const { botToken, admins } = require("../config/config");
const {
  handleStart,
  handleUserInfo,
  handleSubscribe,
  handleUnsubscribe,
  handleSetCity,
  subscribers,
} = require("../commands/commands");
const {
  handleAdmin,
  handleBlock,
  handleUnblock,
  handleUpdateApi,
  handleViewUsers,
  handleDelete,
} = require("../admin/admin");
const { getWeather } = require("../utils/utils");

const bot = new TelegramBot(botToken, { polling: true });

const helpMessage = `
*Welcome to the Weather Bot!*

Commands:
/start - Welcome message and basic instructions
/userinfo - find user info like- userId, name
/subscribe - Subscribe to receive weather updates
/unsubscribe - Unsubscribe from weather updates
/setcity - Update your city for weather updates
/admin - (Admins only) Access the admin panel
`;

// Commands
bot.onText(/\/start/, (msg) => handleStart(bot, msg));
bot.onText(/\/userinfo/, (msg) => handleUserInfo(bot, msg));
bot.onText(/\/subscribe/, (msg) => handleSubscribe(bot, msg));
bot.onText(/\/unsubscribe/, (msg) => handleUnsubscribe(bot, msg));
bot.onText(/\/setcity/, (msg) => handleSetCity(bot, msg));
bot.onText(/\/admin/, (msg) => handleAdmin(bot, msg, admins, subscribers));

bot.onText(/\/block (.+)/, (msg, match) =>
  handleBlock(bot, msg, match, subscribers)
);
bot.onText(/\/unblock (.+)/, (msg, match) =>
  handleUnblock(bot, msg, match, subscribers)
);
bot.onText(/\/updateapi/, (msg) => handleUpdateApi(bot, msg, admins));
bot.onText(/\/viewusers/, (msg) => handleViewUsers(bot, msg, subscribers));
bot.onText(/\/delete (.+)/, (msg, match) =>
  handleDelete(bot, msg, match, subscribers)
);

// Handle greetings like "hi", "hello", or "hey"
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase(); // Ensure `msg.text` exists

  if (
    text &&
    (text.includes("hi") || text.includes("hello") || text.includes("hey"))
  ) {
    bot.sendMessage(chatId, "Hello! How can I help you?\n" + helpMessage, {
      parse_mode: "Markdown",
    });
  }
});

// Periodic Weather Updates
export const sendWeatherUpdates = async() => {
  for (const [chatId, { subscribed, city }] of subscribers.entries()) {
    if (!subscribed || !city) continue;

    try {
      const weather = await getWeather(city);
      //   console.log(weather)
      if (weather && weather.weather && weather.main) {
        const message = `*Weather in ${weather.name}:*\nCloud: ${weather.weather[0].description} \nTemp: ${weather.main.temp}°C`;
        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
      } else {
        bot.sendMessage(chatId, `Could not fetch weather data for *${city}*.`);
      }
    } catch (error) {
      bot.sendMessage(
        chatId,
        `Error fetching weather for *${city}*: ${error.message}`
      );
    }
  }
}

// Use a reasonable interval for production (e.g., 3600000 ms = 1 hour)
setInterval(sendWeatherUpdates, 3600000);
// setInterval(sendWeatherUpdates, 5000);

module.exports = bot;
