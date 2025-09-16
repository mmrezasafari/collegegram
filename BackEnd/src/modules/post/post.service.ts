import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { UserService } from "../user/user.service";
import { IPostRepository } from "./post.repository";
import { extract } from "../../../utility/extract";
import { MentionService } from "../mention/mention.service";
import { HashtagService } from "../tag/tag.service";
import { PostDto } from "./dto/post.dto";
import { minioClient } from "../../config/minio.config";
import { PostImage } from "./model/post-image";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";

export class PostService {
    constructor(
        private postRepo: IPostRepository,
        private userService: UserService,
        private mentionService: MentionService,
        private hashtagService: HashtagService
    ) { }

    async getPosts(username: string) {
        const user = await this.userService.getUserByUsername(username);
        return await this.postRepo.getPosts(user.id)
    }

    async savePost(files: Express.Multer.File[], caption: string, userId: string, mention: string) {
        const uploads: Partial<PostImage>[] = [];
        files.map((file, index) => {
            const objectName = `${Date.now()}${index}-${file.originalname}`;
            minioClient.putObject("posts", objectName, file.buffer);
            const mimeType = file.mimetype as ImageMimeType
            uploads.push({
                url: objectName,
                mimeType: mimeType
            });
        });
        const usernames = extract(mention, "mention");
        const hashtags = extract(caption, "hashtag");

        const post = await this.postRepo.createPost(userId, uploads, caption);
        if (!post) {
            throw new HttpError(404, "پست  ایجاد نشد")
        }

        const mentionedUsernames = await this.mentionService.savePostMention(usernames, post.id);
        const savedHashtags = await this.hashtagService.savePostHashtags(post.id, hashtags)
        return { post, mentionedUsernames, savedHashtags };
    }
    async getPostById(postId: string) {
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
        const uploads: Partial<PostImage>[] = [];
        const post = await this.getPostById(postId);

        if (dto.imageUrls) {
            const imagesToDelete: string[] = [];

            //get imageName from url
            post.images.map((image) => {
                const lastSlashIndex = image.url.lastIndexOf("/");
                const questionMarkIndex = image.url.indexOf("?", lastSlashIndex);
                let fileName: string;
                if (questionMarkIndex === -1) {
                    // اگر ? نبود، کل رشته بعد از / میگیریم
                    fileName = image.url.slice(lastSlashIndex + 1);
                } else {
                    // اگر ? بود، فقط تا قبلش
                    fileName = image.url.slice(lastSlashIndex + 1, questionMarkIndex);
                }
                image.url = fileName;
                if (!dto.imageUrls?.includes(image.url)) {
                    imagesToDelete.push(image.url)
                }
            });

            //Delete from Minio & DB
            for (const url of imagesToDelete) {
                if (!url) {
                    throw new HttpError(400, "مسیر عکس‌ها اشتباه است")
                }
                await minioClient.removeObject("posts", url);
                await this.postRepo.removeImage(url);
            }
        }
        // Add new image to post
        files.map((file, index) => {
            const objectName = `${Date.now()}${index}-${file.originalname}`;
            minioClient.putObject("posts", objectName, file.buffer);
            const mimeType = file.mimetype as ImageMimeType
            uploads.push({
                url: objectName,
                mimeType,
            });
        });
        await this.postRepo.updatePost(postId, userId, uploads, dto.caption);
        const updatedPost = await this.getPostById(postId);

        const usernames = dto.mention ? extract(dto.mention, "mention") : null;
        await this.mentionService.removePostMentions(postId);
        if (usernames) {
            await this.mentionService.savePostMention(usernames, postId);
        }
        const hashtags = dto.caption ? extract(dto.caption, "hashtag") : null;
        await this.hashtagService.removePostHashtags(postId);
        if (hashtags) {
            await this.hashtagService.savePostHashtags(postId, hashtags)
        }
        return { updatedPost, usernames, hashtags }
    }
    async getFollowingPosts(usersId: string[], offset: number, limit: number, sort: string) {
        return await this.postRepo.getFollowingPosts(usersId, offset, limit, sort);
    }
}