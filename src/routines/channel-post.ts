import { Request, Response } from 'express';

import { bot } from '../core/bot';
import { config } from '../config';
import { Job } from '../core/types/job';
import {
    BackendBrService,
    JerimumJobsService,
    PostsService,
    FrontendBrService,
} from '../services';

export async function channelPostRoutine(req: Request, res: Response) {
    const jerimumJobsService = new JerimumJobsService();
    const backendBrService = new BackendBrService();
    const frontendBrService = new FrontendBrService();
    const postsService = new PostsService();

    const [posts, ...jobs] = await Promise.all([
        postsService.getPostUrls(),
        jerimumJobsService.getJobs(),
        backendBrService.getJobs(),
        frontendBrService.getJobs(),
    ]);
    const postsUrls = posts.map((post) => post.url);

    for (const job of jobs.flat()) {
        const wasPostedToday =
            job.date.toDateString() === new Date().toDateString();

        if (!wasPostedToday) continue;
        if (postsUrls.includes(job.url)) continue;

        const message = getPostMessage(job);
        const provider = getProvider(job.url);

        await Promise.all([
            postsService.addPost({ ...job, provider }),
            bot.api.sendMessage(config.channelId, message, {
                parse_mode: 'HTML',
            }),
        ]);
    }

    return res.status(200).send({ ok: true });
}

function getPostMessage(job: Job) {
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
        optional('Nível de experiência', job.level) +
        required(
            'Data',
            `${job.date.getDate()}/${
                job.date.getMonth() + 1
            }/${job.date.getFullYear()}`
        )
    );
}

function getProvider(url: string): string {
    if (url.startsWith('https://jerimumjobs.imd.ufrn.br')) {
        return 'jerimumjobs';
    }

    if (url.startsWith('https://github.com/backend-br/vagas')) {
        return 'backend-br';
    }

    if (url.startsWith('https://github.com/frontendbr/vagas')) {
        return 'frontendbr';
    }

    return '';
}
