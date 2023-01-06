import "dotenv/config";
import cron from "node-cron";
import express from "express";
import { webhookCallback } from "grammy";

import { bot } from "./core/bot";
import { channelPostRoutine } from "./routines/channel-post";
import { config } from "./config";

async function bootstrap() {
  cron.schedule(config.routinesCron, channelPostRoutine);

  if (config.nodeEnv === "production") {
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));

    app.listen(config.port, () =>
      console.log(`[BOT] Started successfully on port ${config.port}.`)
    );
  } else {
    bot.start({ onStart: () => console.log("[BOT] Started successfully.") });
  }
}

bootstrap();
