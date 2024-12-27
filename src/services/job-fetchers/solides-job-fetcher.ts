import puppeteer from "puppeteer";
import { Job } from "../../core/types/job";
import { logger } from "../../logger/logger";
import { JobFetcher } from "./job-fetcher";
import { puppeteerLaunchSettings } from "../../config/puppeteer";

type SolidesVagasPost = {
    title: string;
    path: string;
    company: string;
    salary: string;
    level: string;
    workType: string;
    date: string;
}

export class SolidesVagasJobFetcher implements JobFetcher {
    private readonly URL = 'https://vagas.solides.com.br/vagas?page=1&locals=&title=desenvolvedor&jobsType=remoto';
    private readonly BASE_URL = 'https://vagas.solides.com.br';

    async fetch(): Promise<Job[]> {
        const jobs: Job[] = [];

        const browser = await puppeteer.launch(puppeteerLaunchSettings);

        try {
            const page = await browser.newPage();

            await page.goto(this.URL);
            await page.waitForSelector('ul[data-cy="list-vacancies"]');

            const posts: SolidesVagasPost[] = await page.$$eval('ul[data-cy="list-vacancies"] > li', posts => {
                return posts.map(post => {
                    const title = post.querySelector('h3[data-cy="vacancy-title"]')?.textContent ?? "";
                    const path = post.querySelector('a[data-cy="vacancy-details"]')?.getAttribute('href') ?? "";
                    const company = post.querySelector('p[data-cy="vacancy-company-name"]')?.textContent ?? "";
                    const salary = post.querySelector('p[data-cy="vacancy-salary"]')?.textContent?.trim() ?? "";
                    const level = post.querySelector('div[data-cy="badges_seniority"]')?.textContent ?? "";
                    const workType = post.querySelector('div[data-cy="badges_contract_type"]')?.textContent ?? "";
                    const date = post.querySelector('time[data-cy="vacancy-date"]')?.textContent ?? "";

                    return {
                        title,
                        path,
                        company,
                        salary,
                        level,
                        workType,
                        date
                    };
                });
            });

            for (const post of posts) {
                if (!post.date.includes('horas')) continue;

                jobs.push(this.buildJob(post));
            }
        } catch (e) {
            logger.error("Error while fetching Solides Vagas jobs", e)
        }

        await browser.close();

        return jobs;
    }

    private buildJob(post: SolidesVagasPost) {
        return new Job.Builder()
            .withTitle(post.title)
            .withDate(new Date())
            .withUrl(this.BASE_URL + post.path)
            .withCompany(post.company)
            .withLevel(post.level)
            .withWorkType(post.workType)
            .withSalary(post.salary)
            .withProvider('solides')
            .build();
    }
}