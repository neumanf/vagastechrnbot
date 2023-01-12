import { Request, Response } from 'express';

import { bot } from '../core/bot';
import { config } from '../config';
import { Job } from '../core/interfaces/job';
import { BackendBrService, JerimumJobsService, PostsService } from '../services';

function getPostMessage(job: Job) {
    const required = (title: string, field: string) => `<b>${title}:</b> ${field}\n`;
    const optional = (title: string, field?: string) =>
        field ? `<b>${title}:</b> ${field}\n` : '';

    return (
        `👨‍💻 <a href="${job.url}">${job.name}</a>\n` +
        '\n' +
        required('Área', job.field) +
        optional('Empresa', job.company) +
        optional('Regime', job.workType) +
        optional('Salário', job.salary) +
        required(
            'Data',
            `${job.date.getDate()}/${job.date.getMonth() + 1}/${job.date.getFullYear()}`
        )
    );
}

export async function channelPostRoutine(req: Request, res: Response) {
    const jerimumJobsService = new JerimumJobsService();
    const backendBrService = new BackendBrService();
    const postsService = new PostsService();

    const [posts, ...jobs] = await Promise.all([
        postsService.getPostUrls(),
        jerimumJobsService.getJobs(),
        backendBrService.getJobs(),
    ]);
    const postsUrls = posts.map((p) => p.url);

    for (const job of jobs.flat()) {
        if (postsUrls.includes(job.url)) continue;

        const message = getPostMessage(job);

        await postsService.addPost(job.url);
        await bot.api.sendMessage(config.channelId, message, {
            parse_mode: 'HTML',
        });
    }

    return res.status(200).send({ ok: true });
}
