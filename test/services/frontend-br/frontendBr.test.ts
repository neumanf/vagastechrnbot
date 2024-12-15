import { FrontendBrJobFetcher } from '../../../src/services/job-fetchers/frontendbr-job-fetcher';

describe('FrontendBrService', () => {
    it('should return a list of job posts', async () => {
        const frontendBrService = new FrontendBrJobFetcher();

        const jobs = await frontendBrService.fetch();
        const firstJob = jobs[0];

        expect(jobs).toBeDefined();
        expect(firstJob).toMatchObject({
            name: expect.any(String),
            field: 'Desenvolvimento',
            date: expect.any(Date),
            url: expect.any(String),
        });
    });
});
