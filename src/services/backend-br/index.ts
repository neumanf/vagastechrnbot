import axios from "axios";

import { Job } from "../../core/interfaces/job";

export class BackendBrService {
  async getJobs(): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      const { data: posts } = await axios.get(
        "https://api.github.com/repos/backend-br/vagas/issues?state=open&labels=Remoto"
      );

      for (const post of posts) {
        const workTypeIsKnown = post.labels.find(
          (l: any) => l.name === "PJ" || l.name === "CLT"
        );

        const job: Job = {
          date: new Date(post.created_at),
          field: "Desenvolvimento",
          workType: workTypeIsKnown && workTypeIsKnown.name,
          name: post.title,
          url: post.html_url,
        };
        jobs.push(job);
      }
    } catch (e) {
      console.error(e);
    }

    return jobs;
  }
}
