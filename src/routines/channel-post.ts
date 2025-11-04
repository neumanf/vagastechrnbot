import { bot } from '../core/bot';
import { config } from '../config';
import { Job } from '../core/types/job';
import {
    BackendBrJobFetcher,
    PostsService,
    FrontendBrJobFetcher,
} from '../services';
import { logger } from '../logger/logger';
import { setTimeout } from 'timers/promises';
import { RemotarJobFetcher } from '../services/job-fetchers/remotar-job-fetcher';
import { ProgramathorJobFetcher } from '../services/job-fetchers/programathor-job-fetcher';
import { HimalayasJobFetcher } from '../services/job-fetchers/himalayas-job-fetcher';
import { SolidesVagasJobFetcher } from '../services/job-fetchers/solides-job-fetcher';
import { databaseErrors } from '../core/database/errors';
import { StriderJobFetcher } from '../services/job-fetchers/strider-job-fetcher';

const POSTING_DELAY_IN_MS = 1000;

export async function channelPostRoutine() {
    logger.info("Starting channel posting routine");

    const postsService = new PostsService();

    const jobs: Job[][] = [];

    const fetchers = [
        new BackendBrJobFetcher(),
        new FrontendBrJobFetcher(),
        new RemotarJobFetcher(),
        new ProgramathorJobFetcher(),
        new HimalayasJobFetcher(),
        new SolidesVagasJobFetcher(),
        new StriderJobFetcher()
    ];

    for (const fetcher of fetchers) {
        logger.info(`Fetching jobs using ${fetcher.constructor.name}`)
        jobs.push(await fetcher.fetch());
    }

    const allJobs = jobs.flat();
    logger.info(`Found ${allJobs.length} jobs`);

    for (const job of allJobs) {
        if (!job.company || config.blacklistedCompanies.includes(job.company)) continue;

        const message = getPostMessage(job);
        const provider = job.provider;

        try {
            await postsService.addPost({ ...job, provider });

            logger.info(`Posting new job with URL "${job.url}"`);

            await bot.api.sendMessage(config.channelId, message, {
                parse_mode: 'HTML',
            })

            setTimeout(POSTING_DELAY_IN_MS, () => { });
        } catch (e: any) {
            if (e.code === databaseErrors.UNIQUE) {
                return;
            }
            logger.error("Error while posting job", e);
        }
    }
}

function getPostMessage(job: Job): string {
    const required = (title: string, field: string) =>
        `<b>${title}:</b> ${field}\n`;
    const optional = (title: string, field?: string) =>
        field ? `<b>${title}:</b> ${field}\n` : '';

    return (
        `👨‍💻 <a href="${job.url}">${job.title}</a>\n` +
        '\n' +
        optional('Empresa', job.company) +
        optional('Regime', job.workType) +
        optional('Salário', job.salary) +
        optional('Nível de experiência', job.level)
    );
}
