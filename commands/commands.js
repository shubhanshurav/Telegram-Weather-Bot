const subscribers = new Map();

// Helper functions
const sendHelpMessage = (bot, chatId) => {
  const helpMessage = `
  *Welcome to the Weather Bot!*

  Commands:
  /userinfo - Find user info like User ID, Name
  /subscribe - Subscribe to receive weather updates
  /unsubscribe - Unsubscribe from weather updates
  /setcity - Update your city for weather updates
  /admin - (Admins only) Access the admin panel
  `;
  bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
};

const getUserInfo = (msg) => {
  const chatId = msg.chat.id;
  const name = `${msg.chat.first_name || ""} ${
    msg.chat.last_name || ""
  }`.trim();
  return { chatId, name };
};

const getWeatherInfo = async (bot, chatId, city, getWeather) => {
  try {
    const weather = await getWeather(city);
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
};

const handleStart = (bot, msg) => {
  const { chatId } = getUserInfo(msg);
  sendHelpMessage(bot, chatId);
};

const handleUserInfo = (bot, msg) => {
  const { chatId, name } = getUserInfo(msg);
  bot.sendMessage(chatId, `Your ID: ${chatId}\nName: ${name}`, {
    parse_mode: "Markdown",
  });
};

const handleSubscribe = async (bot, msg, getWeather) => {
  const { chatId, name } = getUserInfo(msg);
  bot.sendMessage(chatId, "Enter your city for weather updates:");

  bot.once("message", (response) => {
    const city = response.text.trim();
    subscribers.set(chatId, { subscribed: true, city, name });
    getWeatherInfo(bot, chatId, city, getWeather);
    bot.sendMessage(chatId, `Subscribed to weather updates for *${city}*!`, {
      parse_mode: "Markdown",
    });
  });
};

const handleUnsubscribe = (bot, msg) => {
  const { chatId } = getUserInfo(msg);
  if (subscribers.has(chatId)) {
    subscribers.delete(chatId);
    bot.sendMessage(chatId, "Unsubscribed from weather updates.");
  } else {
    bot.sendMessage(chatId, "You are not subscribed to any updates.");
  }
};

const handleSetCity = (bot, msg, getWeather) => {
  const { chatId } = getUserInfo(msg);
  bot.sendMessage(chatId, "Enter your new city:");

  bot.once("message", (response) => {
    const city = response.text.trim();
    if (subscribers.has(chatId)) {
      subscribers.get(chatId).city = city;
      bot.sendMessage(chatId, `City updated to *${city}*!`, {
        parse_mode: "Markdown",
      });
      getWeatherInfo(bot, chatId, city, getWeather);
    } else {
      bot.sendMessage(chatId, "Not subscribed. Use /subscribe first.");
    }
  });
};

// Exports
module.exports = {
  handleStart,
  handleUserInfo,
  handleSubscribe,
  handleUnsubscribe,
  handleSetCity,
  getWeatherInfo,
  subscribers,
};
