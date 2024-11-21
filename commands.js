const subscribers = new Map();
const helpMessage = `
*Welcome to the Weather Bot!*

Commands:
/start - Welcome message and basic instructions
/subscribe - Subscribe to receive weather updates
/unsubscribe - Unsubscribe from weather updates
/setcity - Update your city for weather updates
/admin - (Admins only) Access the admin panel
`;

module.exports = {
  handleStart: (bot, msg) => {
    bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: "Markdown" });
  },

  handleSubscribe: (bot, msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Enter your city for weather updates:");

    bot.once("message", (response) => {
      const city = response.text.trim();
      subscribers.set(chatId, { subscribed: true, city });
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
