const express = require("express");
const app = express();
const bot = require("./bot/bot");
const { botToken } = require("./config/config");

const port = process.env.PORT || 3000;
// const webhookUrl = ` https://telegram-bot-for-weather-update.onrender.com/bot${botToken}`;
const webhookUrl = `https://telegram-bot-for-weather-update.onrender.com/bot${botToken}`;

// Set the bot webhook
bot.setWebHook(webhookUrl);

// Parse webhook updates
app.use(express.json());
app.post(`/bot${botToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Bot running on port ${port}`);
});
