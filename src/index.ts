import 'dotenv/config';

import { apiThrottler } from '@grammyjs/transformer-throttler';

import { bot } from './core/bot';
import { startComposer } from './commands/start';
import { logger } from './logger/logger';
import { setupRoutines } from './routines';
import { HimalayasJobFetcher } from './services/job-fetchers/himalayas-job-fetcher';
import { ProgramathorJobFetcher } from './services/job-fetchers/programathor-job-fetcher';

async function bootstrap() {
    bot.use(startComposer);
    bot.api.config.use(apiThrottler());

    await bot.start({
        onStart: async () => {
            logger.info('Bot started successfully');

            // setupRoutines();

            const a = new ProgramathorJobFetcher();
            await a.fetch();
        },
    });
}

bootstrap();
