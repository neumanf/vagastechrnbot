import puppeteer from "puppeteer";
import { Job } from "../../core/types/job";
import { JobFetcher } from "./job-fetcher";
import { puppeteerLaunchSettings } from "../../config/puppeteer";
import { logger } from "../../logger/logger";

type ProgramathorPost = {
    title: string;
    path: string;
    company: string;
    salary: string;
    level: string;
    workType: string;
}

export class ProgramathorJobFetcher implements JobFetcher {
    private readonly URL = 'https://programathor.com.br/jobs-city/remoto';
    private readonly BASE_URL = 'https://programathor.com.br';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const browser = await puppeteer.launch(puppeteerLaunchSettings);
            const page = await browser.newPage();

            await page.goto(this.URL);
            await page.waitForSelector('.cell-list');

            const posts: ProgramathorPost[] = await page.$$eval('.cell-list', posts => {
                return posts.map(post => {
                    const titleWrapper = post.querySelector('h3');
                    const path = post.querySelector('a')?.getAttribute('href');
                    const infoWrapper = post.querySelectorAll('.cell-list-content-icon > span');

                    const result = {
                        title: titleWrapper?.textContent ?? "",
                        path: path ?? "",
                        company: "",
                        salary: "",
                        level: "",
                        workType: ""
                    }

                    infoWrapper.forEach(info => {
                        const iconClasses = info.querySelector('i')?.className;

                        if (iconClasses?.includes("briefcase")) {
                            result.company = info.textContent ?? "";
                        } else if (iconClasses?.includes("money")) {
                            result.salary = info.textContent ?? "";
                        } else if (iconClasses?.includes("chart")) {
                            result.level = info.textContent ?? "";
                        } else if (iconClasses?.includes("file")) {
                            result.workType = info.textContent ?? "";
                        }
                    })

                    return result;
                })
            })

            for (const post of posts) {
                if (!post || !post.title) continue;

                jobs.push(this.buildJob(post));
            }
        } catch (e) {
            logger.error("Error while fetching Programathor jobs", e);
        }

        return jobs;
    }

    private buildJob(post: ProgramathorPost): Job {
        return new Job(post.title, 'Desenvolvimento', new Date(), this.BASE_URL + post.path, post.company, post.workType, post.salary, post.level);
    }
}