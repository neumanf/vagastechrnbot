import 'dotenv/config';

import { apiThrottler } from '@grammyjs/transformer-throttler';
import schedule from 'node-schedule';

import { bot } from './core/bot';
import { channelPostRoutine } from './routines/channel-post';
import { startComposer } from './commands/start';
import { logger } from './logger/logger';

async function bootstrap() {
    bot.use(startComposer);
    bot.api.config.use(apiThrottler());

    await bot.start({
        onStart: () => {
            logger.info('Bot started successfully');
            schedule.scheduleJob('0 */3 * * *', channelPostRoutine);
        },
    });
}

bootstrap();
