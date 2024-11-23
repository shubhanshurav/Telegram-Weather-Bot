require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  ADMINS: new Set([1543059186]),  // Replace with your admin IDs
};
