import 'dotenv/config';
import express from 'express';
import { webhookCallback } from 'grammy';

import { bot } from './core/bot';
import { channelPostRoutine } from './routines/channel-post';
import { config } from './config';
import { startComposer } from './commands/start';
import { PostsService } from './services';

async function bootstrap() {
    bot.use(startComposer);

    const ps = new PostsService();
    console.log(await ps.addPost('https://github.com/backend-br/vagas/issues/10547'));
    console.log(await ps.getPostUrls());

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
