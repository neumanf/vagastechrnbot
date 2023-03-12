import { FrontendBrService } from '../../../src/services/frontend-br';

describe('FrontendBrService', () => {
    it('should return a list of job posts', async () => {
        const frontendBrService = new FrontendBrService();

        const jobs = await frontendBrService.getJobs();
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
