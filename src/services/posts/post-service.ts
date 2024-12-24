import { Posts } from '../../core/database';
import { Post } from '../../core/types/post';

export class PostsService {
    async getPostUrlsFromThisMonth(): Promise<string[]> {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() > 0 ? today.getMonth() - 1 : 11, today.getDate());

        const posts = await Posts()
            .select('url')
            .where('date', '>', lastMonth);

        return posts.map(post => post.url);
    }

    async addPost(post: Omit<Post, 'id'>) {
        return Posts().insert(post);
    }
}
