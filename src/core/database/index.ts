import knex from 'knex';

import { config } from '../../config';
import { Post } from '../types/post';

const mysql = knex({
    client: 'mysql2',
    connection: {
        uri: config.dbUrl,
    },
});

export const Posts = () => mysql<Post>('posts');

export default mysql;
