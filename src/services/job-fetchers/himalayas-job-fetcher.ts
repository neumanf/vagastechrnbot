import { JobFetcher } from "./job-fetcher";
import puppeteer from "puppeteer";
import { puppeteerLaunchSettings } from "../../config/puppeteer";
import { logger } from "../../logger/logger";
import { Job } from "../../core/types/job";

type HimalayasPost = {
    title: string;
    path: string;
    company: string;
    time: string;
}

export class HimalayasJobFetcher implements JobFetcher {
    private readonly URL = 'https://himalayas.app/jobs/countries/brazil/software-engineer?experience=entry-level%2Cmid-level%2Csenior&type=full-time%2Cpart-time%2Ccontractor&sort=recent';
    private readonly BASE_URL = 'https://himalayas.app';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        const browser = await puppeteer.launch(puppeteerLaunchSettings);

        try {
            const page = await browser.newPage();

            await page.goto(this.URL);
            await page.waitForSelector('article');

            const posts: HimalayasPost[] = await page.$$eval('article', posts => {
                return posts.map(post => {
                    const titleWrapper = post.querySelector('a');
                    const path = titleWrapper?.getAttribute('href');
                    const time = post.querySelector('time')?.textContent;
                    const company = post.querySelector('div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)')?.textContent;

                    const result = {
                        title: titleWrapper?.textContent ?? "",
                        path: path ?? "",
                        company: company ?? "",
                        time: time ?? "",
                    }

                    return result;
                })
            })

            for (const post of posts) {
                if (!post || !post.title) continue;

                const wasPostedToday = post.time.includes("hours ago");

                if (!wasPostedToday) continue;

                jobs.push(this.buildJob(post));
            }
        } catch (e) {
            logger.error("Error while fetching Himalayas jobs", e);
        }

        await browser.close();

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