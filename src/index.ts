import 'dotenv/config';
import express from 'express';
import { webhookCallback } from 'grammy';

import { bot } from './core/bot';
import { channelPostRoutine } from './routines/channel-post';
import { config } from './config';
import { startComposer } from './commands/start';

async function bootstrap() {
    bot.use(startComposer);

    if (config.nodeEnv === 'production') {
        const app = express();
        app.use(express.json());

        app.get('/channel-post-routine', channelPostRoutine);

        app.use(webhookCallback(bot, 'express'));
        await bot.api.setWebhook(`${config.cyclicUrl}/${config.botToken}`);

        app.listen(config.port, () =>
            console.log(`[BOT] Started successfully on port ${config.port}.`)
        );
    } else {
        bot.start({ onStart: () => console.log('[BOT] Started successfully.') });
    }
}

bootstrap();
