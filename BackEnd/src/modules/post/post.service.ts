import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { UserService } from "../user/user.service";
import { IPostRepository } from "./post.repository";

export class PostService {
    constructor(
        private postRepo: IPostRepository,
        private userService: UserService
    ) { }

    async getPosts(username: string) {
        const user = await this.userService.getUserByUsername(username);
        return await this.postRepo.getPosts(user.id)
    }

    async savePost(files: Express.Multer.File[], caption: string, userId: string) {
        const imagePaths: string[] = files.map(file => file.path);
        const post = await this.postRepo.createPost(userId, imagePaths, caption);
        return post;
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