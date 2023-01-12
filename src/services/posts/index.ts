import { createPool } from 'mysql2/promise';

import { config } from '../../config';

const db = createPool(config.dbUrl);

type Post = {
    url: string;
};

export class PostsService {
    async getPostUrls(): Promise<Post[]> {
        const [posts] = await db.query('SELECT url from posts');

        if (!posts) return [];

        return posts as Post[];
    }

    async addPost(url: string) {
        return db.execute('INSERT INTO posts (url) VALUES (?)', [url]);
    }
}
