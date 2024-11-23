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
    // console.log(response)
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    // console.log("error", error);
    return false;
  }
}

async function updateConfig(key, value) {
  if (key === "WEATHER_API_KEY"){
    const isValid = await validateApiKey(value);
    if (isValid) {
      process.env.WEATHER_API_KEY = value;
      saveConfig({ weatherApiKey: value }); 
      console.log("Weather API key updated successfully.");
      return true;
    } else {
      console.log("Invalid Weather API key.");
      return false;
    }
  } else if (key === "BOT_TOKEN") {
    process.env.BOT_TOKEN = value;
    saveConfig({ botToken: value }); // Save to persistent storage
    console.log("Telegram bot token updated successfully.");
    return true;
  } else {
    console.log("No matching config for update.");
    return false;
  }
}


module.exports = { getWeather, updateConfig };
