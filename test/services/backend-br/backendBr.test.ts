import nock from "nock";

import { BackendBrService } from "../../../src/services";
import {
  fullResponseStub,
  knownWorkTypeResponseStub,
  unknownWorkTypeResponseStub,
} from "./backendBr.stubs";

describe("BackendBrService", () => {
  const baseUrl = "https://api.github.com";
  const route = "/repos/backend-br/vagas/issues?state=open&labels=Remoto";

  test("should return valid jobs", async () => {
    nock(baseUrl).get(route).reply(200, fullResponseStub);
    const backendBrService = new BackendBrService();
    const stub = fullResponseStub;

    const jobs = await backendBrService.getJobs();

    expect(jobs).toEqual([
      {
        name: stub[0].title,
        field: "Desenvolvimento",
        url: stub[0].html_url,
        date: new Date(stub[0].created_at),
        workType: "PJ",
      },
      {
        name: stub[1].title,
        field: "Desenvolvimento",
        url: stub[1].html_url,
        date: new Date(stub[1].created_at),
        workType: "CLT",
      },
    ]);
  });

  test("should return a valid job when work type is known", async () => {
    nock(baseUrl).get(route).reply(200, knownWorkTypeResponseStub);
    const backendBrService = new BackendBrService();

    const jobs = await backendBrService.getJobs();

    expect(jobs.length).toEqual(1);
    expect(jobs[0]).toMatchObject({
      workType: "PJ",
    });
  });

  test("should return a valid job with no work type when it is unknown", async () => {
    nock(baseUrl).get(route).reply(200, unknownWorkTypeResponseStub);
    const backendBrService = new BackendBrService();

    const jobs = await backendBrService.getJobs();

    expect(jobs.length).toEqual(1);
    expect(jobs[0]).toMatchObject({
      workType: undefined,
    });
  });
});
