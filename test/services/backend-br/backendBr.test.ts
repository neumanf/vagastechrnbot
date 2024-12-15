import { BackendBrJobFetcher } from '../../../src/services';

describe('BackendBrService', () => {
    it('should return a list of job posts', async () => {
        const backendBrService = new BackendBrJobFetcher();

        const jobs = await backendBrService.fetch();
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
