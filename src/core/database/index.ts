import knex from 'knex';

import { config } from '../../config';
import { Job } from '../types/job';

const postgres = knex({
    client: 'pg',
    connection: config.dbUrl,
});

export const Posts = () => postgres<Job>('posts');

export default postgres;
