import { Job } from "../../core/types/job";
import { JobFetcher } from "./job-fetcher";
import { logger } from "../../logger/logger";
import * as cheerio from 'cheerio';

type StriderPost = {
    title: string;
    path: string;
    level: string;
}

export class StriderJobFetcher implements JobFetcher {
    private readonly URL = 'https://www.onstrider.com/jobs';
    private readonly BASE_URL = 'https://www.onstrider.com';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const response = await fetch(this.URL);
            const html = await response.text();
            const $ = cheerio.load(html);

            const posts: StriderPost[] = [];

            $('.list-container > ul > li').each((_, post) => {
                const path = $(post).children('a:first').attr('href') ?? "";
                const title = $(post).find('h3').text().trim();
                const level = this.getLevel(title.toLowerCase());

                posts.push({
                    title,
                    path,
                    level
                })
            })

            for (const post of posts) {
                if (!post || !post.title) continue;

                jobs.push(this.buildJob(post));
            }
        } catch (e) {
            logger.error("Error while fetching Strider jobs", e);
        }

        return jobs;
    }

    private getLevel(title: string) {
        if (title.includes("jr") || title.includes("junior")) return "Júnior";
        if (title.includes("mid")) return "Pleno";
        if (title.includes("sr") || title.includes("senior")) return "Sênior";
        return "";
    }

    private buildJob(post: StriderPost): Job {
        return new Job.Builder()
            .withTitle(post.title)
            .withDate(new Date())
            .withUrl(this.BASE_URL + post.path)
            .withLevel(post.level)
            .withProvider('strider')
            .build();
    }
}