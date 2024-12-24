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

        const browser = await puppeteer.launch(puppeteerLaunchSettings);

        try {
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
        } catch (e) {
            logger.error("Error while fetching Remotar jobs", e);
        }

        await browser.close();

        return jobs;
    }

    private buildJob(post: RemotarPost): Job {
        let workType = "";
        let level = "";

        for (const label of post.tags) {
            if (label.includes('CLT') || label.includes('PJ') || label.includes('Freelancer')) {
                const parsedWorkType = StringUtils.removeEmojis(label).trim();
                workType = workType ? `${workType}, ${parsedWorkType}` : parsedWorkType;
            }

            if (label.includes('Júnior') || label.includes('Pleno') || label.includes('Sênior')) {
                const parsedLevel = StringUtils.removeEmojis(label).trim();
                level = level ? `${level}, ${parsedLevel}` : parsedLevel;
            }
        }

        return new Job.Builder()
            .withTitle(post.title)
            .withDate(new Date())
            .withUrl(this.BASE_URL + post.path)
            .withCompany(post.company)
            .withWorkType(workType)
            .withLevel(level)
            .withProvider('remotar')
            .build();
    }
} 