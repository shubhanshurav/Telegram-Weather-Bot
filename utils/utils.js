const axios = require("axios");
const { WEATHER_API_KEY } = require("../config/config");

const fs = require("fs");
const path = require("path");

function saveConfig(config) {
  const configPath = path.join(__dirname, "../config/config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("Configuration saved successfully.");
}

async function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${WEATHER_API_KEY}&units=metric`;

  try {
    const response = await axios.get(weatherUrl);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(
      "Unable to fetch weather data. Please check the city name."
    );
  }
}

async function validateApiKey(apiKey) {
  const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(testUrl);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

async function updateConfig(key, value) {
  if (key === "WEATHER_API_KEY") {
    const isValid = await validateApiKey(value);
    if (isValid) {
      process.env.WEATHER_API_KEY = value;
      saveConfig({ WEATHER_API_KEY: value });
      return true;
    } else {
      // console.log("invalid weather api key.");
      return false;
    }
  } else if (key === "BOT_TOKEN") {
    process.env.BOT_TOKEN = value;
    saveConfig({ BOT_TOKEN: value });
    return true;
  } else {
    // console.log("API key not found.");
    return false;
  }
}

module.exports = { getWeather, updateConfig };
