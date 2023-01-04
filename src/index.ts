import "dotenv/config";

import { bot } from "./core/bot";

async function bootstrap() {
  bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

  bot.start({ onStart: () => console.log("[BOT] Started successfully.") });
}

bootstrap();
