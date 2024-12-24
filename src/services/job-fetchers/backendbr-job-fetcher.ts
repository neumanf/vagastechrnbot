import axios from 'axios';

import { Job } from '../../core/types/job';
import { JobFetcher } from './job-fetcher';
import { logger } from '../../logger/logger';
import { GithubIssuesResponse } from '../../types/github-issues-response';

export class BackendBrJobFetcher implements JobFetcher {
    private readonly URL =
        'https://api.github.com/repos/backend-br/vagas/issues?state=open&per_page=10';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const { data: issues } = await axios.get<GithubIssuesResponse[]>(this.URL);

            for (const issue of issues) {
                const isRemoteJob = this.isRemoteJob(issue);

                if (!isRemoteJob) continue;

                const job = this.buildJob(issue);

                const wasPostedToday = job.date.toDateString() === new Date().toDateString();

                if (!wasPostedToday) continue;

                jobs.push(job);
            }
        } catch (e) {
            logger.error("Error while fetching Backend BR jobs", e);
        }

        return jobs;
    }

    private buildJob(issue: GithubIssuesResponse): Job {
        const job = new Job.Builder()
        .withTitle(issue.title)
        .withDate(new Date(issue.created_at))
        .withUrl(issue.html_url)
        .withProvider('backendbr')
        .build();

        for (const label of issue.labels) {
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

    private isRemoteJob(issue: GithubIssuesResponse): boolean {
        const title = issue.title.toLowerCase();
        const hasRemoteLabel = issue.labels.some(label => label.name === 'Remoto');
        return title.includes('remote') || hasRemoteLabel;
    }
}
