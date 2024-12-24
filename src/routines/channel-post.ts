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

const POSTING_DELAY_IN_MS = 1000;

export async function channelPostRoutine() {
    logger.info("Starting channel posting routine");

    const postsService = new PostsService();

    const postsUrls = await postsService.getPostUrlsFromThisMonth();

    const jobs: Job[][] = [];

    const fetchers = [
        new BackendBrJobFetcher(),
        new FrontendBrJobFetcher(),
        new RemotarJobFetcher(),
        new ProgramathorJobFetcher(),
        new HimalayasJobFetcher()
    ];

    for (const fetcher of fetchers) {
        logger.info(`Fetching jobs using ${fetcher.constructor.name}`)
        jobs.push(await fetcher.fetch());
    }

    const allJobs = jobs.flat();
    logger.info(`Found ${allJobs.length} new jobs`);

    for (const job of allJobs) {
        const existsInTheDatabase = postsUrls.includes(job.url);

        if (existsInTheDatabase) continue;

        const message = getPostMessage(job);
        const provider = job.provider;

        try {
            logger.info(`Posting new job with URL "${job.url}"`);

            await Promise.all([
                postsService.addPost({ ...job, provider }),
                bot.api.sendMessage(config.channelId, message, {
                    parse_mode: 'HTML',
                }),
            ]);

            setTimeout(POSTING_DELAY_IN_MS, () => { });
        } catch (e) {
            logger.error("Error while posting jobs", e);
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
