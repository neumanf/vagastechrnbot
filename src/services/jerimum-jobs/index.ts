import * as cheerio from 'cheerio';
import axios from 'axios';

import { Job } from '../../core/interfaces/job';

const TECH_FIELDS = [
    'Banco de Dados',
    'Desenvolvimento',
    'DevOps',
    'Infraestrutura/Redes',
    'Testes',
];

export class JerimumJobsService {
    async getJobs(): Promise<Job[]> {
        const jobs: Job[] = [];

        try {
            const { data } = await axios.get(
                'https://jerimumjobs.imd.ufrn.br/jerimumjobs/oportunidade/listar'
            );
            const $ = cheerio.load(data);
            const posts = $('#oportunidadesDiv > div > a');

            posts.each((idx, el) => {
                const job = this.getJobData($, el);

                const isTechJob = TECH_FIELDS.some((field) => job.field.includes(field));

                if (isTechJob) {
                    jobs.push(job);
                }
            });
        } catch (e) {
            console.error(e);
        }

        return jobs;
    }

    private getJobData($: cheerio.CheerioAPI, el: cheerio.Element) {
        const card = $(el).children('.card-body');

        const name = $(card).children('h2').text().trim();
        const company = $(card).children('p').text().trim();
        const field = $(card).children('div').children('h5:nth-child(1)').text().trim();
        const workType = $(card).children('div').children('h5:nth-child(2)').text().trim();
        const salary = $(card).children('div').children('h5:nth-child(3)').text().trim();
        const rawDate = $(card)
            .children('div')
            .children('h5:nth-child(4)')
            .text()
            .trim()
            .split('/');
        const date = new Date(Number(rawDate[2]), Number(rawDate[1]) - 1, Number(rawDate[0]));
        const url = 'https://jerimumjobs.imd.ufrn.br' + $(el).attr('href');

        return {
            name,
            company,
            field,
            workType,
            salary,
            date,
            url,
        };
    }
}
