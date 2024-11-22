const express = require("express");
const app = express();
const bot = require("./bot/bot");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bot running on port ${port}`);
});
