import "dotenv/config";
import cron from "node-cron";
import express from "express";
import { webhookCallback } from "grammy";

import { bot } from "./core/bot";
import { channelPostRoutine } from "./routines/channel-post";
import { config } from "./config";
import { startComposer } from "./commands/start";

async function bootstrap() {
  cron.schedule(config.routinesCron, channelPostRoutine);

  bot.use(startComposer);

  if (config.nodeEnv === "production") {
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));

    await bot.api.setWebhook(config.cyclicUrl);

    app.listen(config.port, () =>
      console.log(`[BOT] Started successfully on port ${config.port}.`)
    );
  } else {
    await bot.api.deleteWebhook();
    bot.start({ onStart: () => console.log("[BOT] Started successfully.") });
  }
}

bootstrap();
