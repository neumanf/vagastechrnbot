import * as cheerio from "cheerio";
import axios from "axios";

import { Job } from "../../core/interfaces/job";

const TECH_FIELDS = [
  "Banco de dados",
  "Desenvolvimento",
  "DevOps",
  "Infraestrutura/Redes",
  "Testes",
];

export class JerimumJobsService {
  async getJobs(): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      const { data } = await axios.get(
        "https://jerimumjobs.imd.ufrn.br/jerimumjobs/oportunidade/listar"
      );
      const $ = cheerio.load(data);
      const posts = $("#oportunidadesDiv > div > a");

      posts.each((idx, el) => {
        const card = $(el).children(".card-body");
        const job: Job = {
          name: $(card).children("h2").text().trim(),
          company: $(card).children("p").text().trim(),
          field: $(card)
            .children("div")
            .children("h5:nth-child(1)")
            .text()
            .trim(),
          workType: $(card)
            .children("div")
            .children("h5:nth-child(2)")
            .text()
            .trim(),
          salary: $(card)
            .children("div")
            .children("h5:nth-child(3)")
            .text()
            .trim(),
          date: $(card)
            .children("div")
            .children("h5:nth-child(4)")
            .text()
            .trim(),
          url: "https://jerimumjobs.imd.ufrn.br" + $(el).attr("href"),
        };

        const isTechJob = TECH_FIELDS.some((field) =>
          job.field.includes(field)
        );

        if (isTechJob) {
          jobs.push(job);
        }
      });
    } catch (e) {
      console.error(e);
    }

    return jobs;
  }
}
