import { Job } from './job';

export type Post = {
    id: number;
    provider: string;
} & Job;
