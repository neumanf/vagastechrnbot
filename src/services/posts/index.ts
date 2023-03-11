import { Posts } from '../../core/database';
import { Post } from '../../core/types/post';

export class PostsService {
    async getPostUrls() {
        const PROVIDERS = ['jerimumjobs', 'backend-br'];

        return Posts()
            .select('url')
            .union(
                PROVIDERS.map((p) =>
                    Posts()
                        .select('url')
                        .where({ provider: p })
                        .orderBy('id', 'desc')
                        .limit(10)
                ),
                true
            );
    }

    async addPost(post: Omit<Post, 'id'>) {
        return Posts().insert(post);
    }
}
