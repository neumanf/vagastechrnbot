import { Job } from '../../core/types/job';

export interface JobFetcher {
    fetch(): Promise<Job[]>;
}
