import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import { webhookCallback } from 'grammy';
import { apiThrottler } from '@grammyjs/transformer-throttler';

import { bot } from './core/bot';
import { channelPostRoutine } from './routines/channel-post';
import { config } from './config';
import { startComposer } from './commands/start';
import errorHandler from './middlewares/errorHandler';

async function bootstrap() {
    bot.use(startComposer);
    bot.api.config.use(apiThrottler());

    const app = express();

    app.use(express.json());
    app.get('/channel-post-routine', channelPostRoutine);

    if (config.nodeEnv === 'production') {
        app.use(webhookCallback(bot, 'express'));
        await bot.api.setWebhook(`${config.cyclicUrl}/${config.botToken}`);
    } else {
        bot.start({
            onStart: () => console.log('[BOT] Started successfully.'),
        });
    }

    app.use(errorHandler);
    app.listen(config.port, () =>
        console.log(`[BOT] Started successfully on port ${config.port}.`)
    );
}

bootstrap();
