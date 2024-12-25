import { JobFetcher } from "./job-fetcher";
import { logger } from "../../logger/logger";
import { Job } from "../../core/types/job";
import * as cheerio from "cheerio";

type HimalayasPost = {
    title: string;
    path: string;
    company: string;
}

export class HimalayasJobFetcher implements JobFetcher {
    private readonly URL = 'https://himalayas.app/jobs/countries/brazil/software-engineer?experience=entry-level%2Cmid-level%2Csenior&type=full-time%2Cpart-time%2Ccontractor&sort=recent';
    private readonly BASE_URL = 'https://himalayas.app';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const response = await fetch(this.URL);
            const html = await response.text();
            const $ = cheerio.load(html);

            const posts: HimalayasPost[] = [];

            $('article').each((_, post) => {
                const titleWrapper = $(post).children('div:nth-child(2)').children('div:first').children('a');
                const title = $(titleWrapper).text().trim();
                const path = $(titleWrapper).attr('href') ?? "";
                const company = $(post).children('div:nth-child(2)').children('div:nth-child(2)').children('div:first').children('a').text();

                posts.push({
                    title,
                    path,
                    company,
                })
            })

            for (const post of posts) {
                if (!post || !post.title) continue;

                jobs.push(this.buildJob(post));
            }
        } catch (e) {
            logger.error("Error while fetching Himalayas jobs", e);
        }

        return jobs;
    }

    private buildJob(post: HimalayasPost): Job {
        return new Job.Builder()
            .withTitle(post.title)
            .withDate(new Date())
            .withUrl(this.BASE_URL + post.path)
            .withCompany(post.company)
            .withProvider('himalayas')
            .build();
    }
}