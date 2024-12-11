import knex from 'knex';

import { config } from '../../config';
import { Post } from '../types/post';

const postgres = knex({
    client: 'pg',
    connection: config.dbUrl,
});

export const Posts = () => postgres<Post>('posts');

export default postgres;
