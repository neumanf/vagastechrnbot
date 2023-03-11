import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import { webhookCallback } from 'grammy';

import { bot } from './core/bot';
import { channelPostRoutine } from './routines/channel-post';
import { config } from './config';
import { startComposer } from './commands/start';
import errorHandler from './middlewares/errorHandler';

async function bootstrap() {
    bot.use(startComposer);

    const app = express();
    app.use(express.json());

    app.get('/channel-post-routine', channelPostRoutine);

    app.use(errorHandler);

    if (config.nodeEnv === 'production') {
        app.use(webhookCallback(bot, 'express'));
        await bot.api.setWebhook(`${config.cyclicUrl}/${config.botToken}`);
    } else {
        bot.start({
            onStart: () => console.log('[BOT] Started successfully.'),
        });
    }

    app.listen(config.port, () =>
        console.log(`[BOT] Started successfully on port ${config.port}.`)
    );
}

bootstrap();
