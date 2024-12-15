import { puppeteerLaunchSettings } from "../../config/puppeteer";
import { Job } from "../../core/types/job";
import { logger } from "../../logger/logger";
import { StringUtils } from "../../utils/string-utils";
import { JobFetcher } from "./job-fetcher";
import puppeteer from "puppeteer";

type RemotarPost = {
    title: string;
    path: string;
    company: string;
    date: string;
    tags: string[];
}

export class RemotarJobFetcher implements JobFetcher {
    private readonly URL = 'https://remotar.com.br/search/jobs?q=&c=4&c=7&c=13&c=14&c=8&c=9&t=4';
    private readonly BASE_URL = 'https://remotar.com.br';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const browser = await puppeteer.launch(puppeteerLaunchSettings);
            const page = await browser.newPage();

            await page.goto(this.URL);
            await page.waitForSelector('.box-content');

            const posts: RemotarPost[] = await page.$$eval('.box-content > div', posts => {
                return posts.map(post => {
                    const titleWrapper = post.querySelector('.card-header__info > .featured > a');
                    const company = post.querySelector('.card-header__info > .subheading > a > .subheading__company-info > .company')
                    const date = post.querySelector('.card-header__info > .subheading > .created-at')
                    let tags: string[] = [];
                    post.querySelectorAll('.tag-list > div > a').forEach(tag => tag.textContent && tags.push(tag.textContent))

                    return {
                        title: titleWrapper?.textContent?.trim() ?? 'Não especificado',
                        path: titleWrapper?.getAttribute('href') ?? '/',
                        company: company?.textContent?.trim() ?? 'Não especificado',
                        date: date?.textContent?.trim() ?? 'Não especificado',
                        tags: tags
                    };
                });
            });

            for (const post of posts) {
                const wasPostedToday = post.date === 'Hoje';
                const isInvalid = post.title === 'Não especificado';

                if (!wasPostedToday || isInvalid) continue;

                const job = this.buildJob(post);

                jobs.push(job);
            }

            await browser.close();
        } catch (e) {
            logger.error("Error while fetching Remotar jobs", e);
        }

        return jobs;
    }

    private buildJob(post: RemotarPost): Job {
        const job = new Job(post.title, 'Desenvolvimento', new Date(), this.BASE_URL + post.path, post.company);

        for (const label of post.tags) {
            if (label.includes('CLT') || label.includes('PJ') || label.includes('Freelancer')) {
                const workType = StringUtils.removeEmojis(label).trim();
                job.workType = job.workType ? `${job.workType}, ${workType}` : workType;
            }

            if (label.includes('Júnior') || label.includes('Pleno') || label.includes('Sênior')) {
                const level = StringUtils.removeEmojis(label).trim();
                job.level = job.level ? `${job.level}, ${level}` : level;
            }
        }

        return job;
    }
} 