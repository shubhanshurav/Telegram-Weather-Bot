require("dotenv").config();

module.exports = {
  botToken: process.env.BOT_TOKEN,
  weatherApiKey: process.env.WEATHER_API_KEY,
  admins: new Set([1543059186]),
  botUrl: `https://telegram-bot-for-weather-update.onrender.com/bot${process.env.BOT_TOKEN}`,
};
