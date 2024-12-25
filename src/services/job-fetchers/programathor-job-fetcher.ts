import puppeteer from "puppeteer";
import { Job } from "../../core/types/job";
import { JobFetcher } from "./job-fetcher";
import { puppeteerLaunchSettings } from "../../config/puppeteer";
import { logger } from "../../logger/logger";
import * as cheerio from 'cheerio';

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
            const response = await fetch(this.URL);
            const html = await response.text();
            const $ = cheerio.load(html);

            const posts: ProgramathorPost[] = [];

            $('.cell-list').each((_, post) => {
                const path = $(post).children('a:first').attr('href');

                if (!path) return;

                const title = $(post).find('h3').text();

                let company = "";
                let salary = "";
                let level = "";
                let workType = "";

                $(post).find('span').each((_, span) => {
                    const icon = $(span).children('i');

                    if (icon.hasClass('fa-briefcase')) {
                        company = $(span).text();
                    } else if (icon.hasClass('fa-money-bill-alt')) {
                        salary = $(span).text();
                    } else if (icon.hasClass('fa-chart-bar')) {
                        level = $(span).text();
                    } else if (icon.hasClass('fa-file-alt')) {
                        workType = $(span).text();
                    }
                })

                posts.push({
                    title,
                    path,
                    company,
                    salary,
                    level,
                    workType
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
        return new Job.Builder()
            .withTitle(post.title)
            .withDate(new Date())
            .withUrl(this.BASE_URL + post.path)
            .withWorkType(post.workType)
            .withCompany(post.company)
            .withSalary(post.salary)
            .withLevel(post.level)
            .withProvider('programathor')
            .build();
    }
}