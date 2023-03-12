import axios from 'axios';

import { Job } from '../../core/types/job';
import { JobService } from '../job-service';

export class BackendBrService implements JobService {
    private url =
        'https://api.github.com/repos/backend-br/vagas/issues?state=open&labels=Remoto&per_page=10';

    async getJobs(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const { data: posts } = await axios.get(this.url);

            for (const post of posts) {
                const job = this.buildJob(post);

                jobs.push(job);
            }
        } catch (e) {
            console.error(e);
        }

        return jobs;
    }

    private buildJob(post: any) {
        const job: Job = {
            date: new Date(post.created_at),
            field: 'Desenvolvimento',
            name: post.title,
            url: post.html_url,
        };

        for (const label of post.labels) {
            switch (label.name) {
                case 'PJ':
                case 'CLT': {
                    job.workType = job.workType
                        ? `${job.workType}, ${label.name}`
                        : label.name;
                    break;
                }
                case 'Júnior':
                case 'Pleno':
                case 'Sênior': {
                    job.level = job.level
                        ? `${job.level}, ${label.name}`
                        : label.name;
                    break;
                }
                default:
                    break;
            }
        }

        return job;
    }
}
