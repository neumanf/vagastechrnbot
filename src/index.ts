import 'dotenv/config';

import { apiThrottler } from '@grammyjs/transformer-throttler';

import { bot } from './core/bot';
import { startComposer } from './commands/start';
import { logger } from './logger/logger';
import { setupRoutines } from './routines';
import { RemotarJobFetcher } from './services/job-fetchers/remotar-job-fetcher';

async function bootstrap() {
    bot.use(startComposer);
    bot.api.config.use(apiThrottler());

    await bot.start({
        onStart: async () => {
            logger.info('Bot started successfully');

            setupRoutines();
        },
    });
}

bootstrap();
