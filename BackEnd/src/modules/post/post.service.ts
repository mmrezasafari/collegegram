import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { UserService } from "../user/user.service";
import { IPostRepository } from "./post.repository";
import { extract } from "../../../utility/extract";
import { MentionService } from "../mention/mention.service";

export class PostService {
    constructor(
        private postRepo: IPostRepository,
        private userService: UserService,
        private mentionService: MentionService
    ) { }

    async getPosts(username: string) {
        const user = await this.userService.getUserByUsername(username);
        return await this.postRepo.getPosts(user.id)
    }

    async savePost(files: Express.Multer.File[], caption: string, userId: string, mention: string) {
        const imagePaths: string[] = files.map(file => file.path);
        const usernames = extract(mention, "mention");
        const post = await this.postRepo.createPost(userId, imagePaths, caption);
        if (!post){
            throw new HttpError(404, "پست  ایجاد نشد")
        }
        const mentionedUsernames = await this.mentionService.savePostMention(usernames, post.id)
        return {post, mentionedUsernames};
    }
    async getPostById(postId: string): Promise<Post> {
        const post = await this.postRepo.getById(postId)
        if (!post) {
            throw new HttpError(404, "پست یافت نشد");
        }
        return post;
    }
    async countPost(userId: string): Promise<number> {
        return await this.postRepo.countPost(userId);
    }
}