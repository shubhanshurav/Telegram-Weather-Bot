const axios = require("axios");
const { WEATHER_API_KEY } = require("../config/config");

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
console.log(testUrl)
  try {
    const response = await axios.get(testUrl);
    console.log(response)
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

function updateConfig(key, value) {
  if (key === "WEATHER_API_KEY" || key === "BOT_TOKEN") {
    // Validate the API key before updating
    console.log(value)
    validateApiKey(value).then((isValid) => {
      if (isValid) {
        // WEATHER_API_KEY = value; 
        process.env.WEATHER_API_KEY = value;
        console.log(`Updated ${key} to ${value}`);
        return true;
      } else {
        console.log("Failed to update. The provided API key is invalid.");
        return false;
      }
    });
  } else {
    console.log("No matching config for update.");
  }
}

module.exports = { getWeather, updateConfig };
