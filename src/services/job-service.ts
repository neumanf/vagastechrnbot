import { Job } from '../core/types/job';

export interface JobService {
    getJobs(): Promise<Job[]>;
}
