import { Posts } from '../../core/database';
import { Post } from '../../core/types/post';

export class PostsService {
    async getPostUrlsFromToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return Posts()
            .select('url')
            .where('date', '>', today);
    }

    async addPost(post: Omit<Post, 'id'>) {
        return Posts().insert(post);
    }
}
