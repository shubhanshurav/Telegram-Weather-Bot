const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN, ADMINS } = require("../config/config");
const {
  handleStart,
  handleUserInfo,
  handleSubscribe,
  handleUnsubscribe,
  handleSetCity,
  subscribers,
  getWeatherInfo, // Corrected spelling for consistency
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
/userinfo - Find user info like User ID, Name
/subscribe - Subscribe to receive weather updates
/unsubscribe - Unsubscribe from weather updates
/setcity - Update your city for weather updates
/admin - (Admins only) Access the admin panel
`;

// Commands
bot.onText(/\/start/, (msg) => handleStart(bot, msg));
bot.onText(/\/userinfo/, (msg) => handleUserInfo(bot, msg));
bot.onText(/\/subscribe/, (msg) => handleSubscribe(bot, msg, getWeather));
bot.onText(/\/unsubscribe/, (msg) => handleUnsubscribe(bot, msg));
bot.onText(/\/setcity/, (msg) => handleSetCity(bot, msg, getWeather));
bot.onText(/\/admin/, (msg) => handleAdmin(bot, msg, admins, subscribers));

// Admin-specific commands
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
async function sendWeatherUpdates() {
  for (const [chatId, { subscribed, city }] of subscribers.entries()) {
    if (!subscribed || !city) continue;

    try {
      await getWeatherInfo(bot, chatId, city, getWeather);
    } catch (error) {
      console.error(
        `Error sending weather update to chat ID ${chatId}:`,
        error.message
      );
    }
  }
}

setInterval(sendWeatherUpdates, 3600000); // 1 hour interval

module.exports = bot;
