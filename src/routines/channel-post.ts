import { Request, Response } from "express";

import { bot } from "../core/bot";
import { config } from "../config";
import { Job } from "../core/interfaces/job";
import {
  BackendBrService,
  JerimumJobsService,
  PostsService,
} from "../services";

function getPostMessage(job: Job) {
  return `👨‍💻 <a href="${job.url}">${job.name}</a>

${job.company && `<b>Empresa:</b> ${job.company}`}
<b>Área:</b> ${job.field}
${job.workType && `<b>Regime:</b> ${job.workType}`}
${job.salary && `<b>Salário:</b> ${job.salary}`}
<b>Data:</b> ${job.date.getDate()}/${job.date.getMonth()}/${job.date.getFullYear()}
`;
}

export async function channelPostRoutine(req: Request, res: Response) {
  const jerimumJobsService = new JerimumJobsService();
  const backendBrService = new BackendBrService();
  const postsService = new PostsService();

  const [postsUrls, ...jobs] = await Promise.all([
    postsService.getPostUrls(),
    jerimumJobsService.getJobs(),
    backendBrService.getJobs(),
  ]);

  for (const job of jobs.flat()) {
    if (postsUrls.includes(job.url)) continue;

    const message = getPostMessage(job);

    await postsService.updatePostUrls([...postsUrls, job.url]);
    await bot.api.sendMessage(config.channelId, message, {
      parse_mode: "HTML",
    });
  }

  return res.status(200).send({ ok: true });
}
