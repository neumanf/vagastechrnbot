import { JerimumJobsService } from "../services/jerimum-jobs";
import { bot } from "../core/bot";
import { config } from "../config";
import { Job } from "../core/interfaces/job";
import { PostsService } from "../services/posts";

function getPostMessage(job: Job) {
  return `👨‍💻 <a href="${job.url}">${job.name}</a>

<b>Empresa:</b> ${job.company}
<b>Área:</b> ${job.field}
<b>Regime:</b> ${job.workType}
<b>Salário:</b> ${job.salary}
<b>Data:</b> ${job.date.getDate()}/${job.date.getMonth()}/${job.date.getFullYear()}
`;
}

export async function channelPostRoutine() {
  const jerimumJobsService = new JerimumJobsService();
  const postsService = new PostsService();

  const [postsUrls, jobs] = await Promise.all([
    postsService.getPostUrls(),
    jerimumJobsService.getJobs(),
  ]);

  for (const job of jobs) {
    if (postsUrls.includes(job.url)) continue;

    const message = getPostMessage(job);

    await Promise.all([
      bot.api.sendMessage(config.channelId, message, {
        parse_mode: "HTML",
      }),
      postsService.updatePostUrls([...postsUrls, job.url]),
    ]);
  }
}
