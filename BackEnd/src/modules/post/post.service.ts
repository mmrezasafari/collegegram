import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { UserService } from "../user/user.service";
import { IPostRepository } from "./post.repository";
import { extract } from "../../../utility/extract";
import { MentionService } from "../mention/mention.service";
import { HashtagService } from "../tag/tag.service";
import { string } from "zod";
import { PostDto } from "./dto/post.dto";

export class PostService {
    constructor(
        private postRepo: IPostRepository,
        private userService: UserService,
        private mentionService: MentionService,
        private hashtagSarvice: HashtagService
    ) { }

    async getPosts(username: string) {
        const user = await this.userService.getUserByUsername(username);
        return await this.postRepo.getPosts(user.id)
    }

    async savePost(files: Express.Multer.File[], caption: string, userId: string, mention: string) {
        const imagePaths: string[] = files.map(file => file.path);
        const usernames = extract(mention, "mention");
        const hashtags = extract(caption, "hashtag");
        const post = await this.postRepo.createPost(userId, imagePaths, caption);
        if (!post) {
            throw new HttpError(404, "پست  ایجاد نشد")
        }
        const mentionedUsernames = await this.mentionService.savePostMention(usernames, post.id);
        const savedhashtags = await this.hashtagSarvice.savePostHashtags(hashtags, post.id)
        return { post, mentionedUsernames, savedhashtags };
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

    async editPost(postId: string, userId: string, files: Express.Multer.File[], dto: PostDto) {
        const imagePaths: string[] = files.map(file => file.path);
        const updatedPost = await this.postRepo.updatePost(postId, userId, imagePaths, dto.caption, dto.urls)
        if (!updatedPost) {
            throw new HttpError(404, "پست یافت نشد یا ویرایش انجام نشد");
        }
        const usernames = dto.mention ? extract(dto.mention, "mention") : null;
        if (usernames) {
            await this.mentionService.removePostMentions(postId);
            await this.mentionService.savePostMention(usernames, postId);
        }
        return { updatedPost, usernames }
    }
    async getFollowingPosts(usersId: string[], offset: number, limit: number, sort: string) {
        return await this.postRepo.getFollowingPosts(usersId, offset, limit, sort);
    }
}