import { createPool } from 'mysql2/promise';

import { config } from '../../config';

const db = createPool(config.dbUrl);

type Post = {
    url: string;
};

export class PostsService {
    async getPostUrls(): Promise<Post[]> {
        const queries = [
            '(SELECT url FROM posts WHERE provider="jerimumjobs" ORDER BY id DESC LIMIT 0, 10)',
            '(SELECT url FROM posts WHERE provider="backend-br" ORDER BY id DESC LIMIT 0, 10)',
        ];
        const [posts] = await db.query(queries.join(' UNION '));

        if (!posts) return [];

        return posts as Post[];
    }

    async addPost(url: string, provider: string) {
        return db.execute('INSERT INTO posts (url, provider) VALUES (?, ?)', [url, provider]);
    }
}
