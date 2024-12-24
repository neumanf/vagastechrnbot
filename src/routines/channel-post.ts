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

    const backendBrJobFetcher = new BackendBrJobFetcher();
    const frontendBrJobFetcher = new FrontendBrJobFetcher();
    const remotarJobFetcher = new RemotarJobFetcher();
    const programathorJobFetcher = new ProgramathorJobFetcher();
    const himalayasJobFetcher = new HimalayasJobFetcher();

    const [posts, ...jobs] = await Promise.all([
        postsService.getPostUrlsFromToday(),
        backendBrJobFetcher.fetch(),
        frontendBrJobFetcher.fetch(),
        remotarJobFetcher.fetch(),
        programathorJobFetcher.fetch(),
        himalayasJobFetcher.fetch()
    ]);
    const allJobs = jobs.flat();
    logger.info(`Found ${allJobs.length} new jobs`);

    const postsUrls = posts.map((post) => post.url);

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
        `👨‍💻 <a href="${job.url}">${job.name}</a>\n` +
        '\n' +
        required('Área', job.field) +
        optional('Empresa', job.company) +
        optional('Regime', job.workType) +
        optional('Salário', job.salary) +
        optional('Nível de experiência', job.level)
    );
}
