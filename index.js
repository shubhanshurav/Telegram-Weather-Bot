const express = require("express");
const app = express();
const { botToken, botUrl } = require("./config/config");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(botToken);
const port = process.env.PORT || 3000;
const webhookUrl = botUrl;
console.log(botUrl)


bot.setWebHook(webhookUrl);

app.use(express.json());
app.post(`/bot/${botToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Bot running on port ${port}`);
});
