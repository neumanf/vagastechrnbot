import "dotenv/config";
import cron from "node-cron";

import { bot } from "./core/bot";
import { channelPostRoutine } from "./routines/channel-post";
import { config } from "./config";

async function bootstrap() {
  cron.schedule(config.routinesCron, channelPostRoutine);

  bot.start({ onStart: () => console.log("[BOT] Started successfully.") });
}

bootstrap();
