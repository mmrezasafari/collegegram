import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { UserService } from "../user/user.service";
import { IPostRepository } from "./post.repository";
import { extract } from "../../../utility/extract";
import { MentionService } from "../mention/mention.service";
import { HashtagService } from "../tag/tag.service";
import { updatePostDto } from "./dto/update-post.dto";
import { createPostDto } from "./dto/create-post.dto";
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

    async getPosts(userId: string) {
        return await this.postRepo.getPosts(userId);
    }

    async savePost(files: Express.Multer.File[], dto: createPostDto, userId: string) {
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

        const post = await this.postRepo.createPost(userId, uploads, dto.caption, dto.onlyCloseFriends);
        if (!post) {
            throw new HttpError(404, "پست ایجاد نشد")
        }

        let mentionedUsernames: string[] | null = null;
        let savedHashtags: string[] | null = null;

        const usernames = dto.mention ? extract(dto.mention, "mention") : null;
        if (usernames) {
            mentionedUsernames = await this.mentionService.savePostMention(usernames, post.id);
        }

        const hashtags = dto.caption ? extract(dto.caption, "hashtag") : null;
        if (hashtags) {
            savedHashtags = await this.hashtagService.savePostHashtags(post.id, hashtags)
        }

        return { post, mentionedUsernames, savedHashtags };
    }

    async getPostById(postId: string, myId: string): Promise<Post> {
        const post = await this.postRepo.getById(postId)
        if (!post) {
            throw new HttpError(404, "پست یافت نشد");
        }
        const canAccess = await this.userService.canAccessResource(myId, post.user!.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این پست را ندارید");
        }
        return post;
    }
    
    async countPost(userId: string): Promise<number> {
        return await this.postRepo.countPost(userId);
    }

    async editPost(postId: string, userId: string, files: Express.Multer.File[], dto: updatePostDto, myId: string) {
        const uploads: Partial<PostImage>[] = [];
        const post = await this.getPostById(postId, myId);

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
        await this.postRepo.updatePost(postId, userId, uploads, dto.caption, dto.onlyCloseFriends);
        const updatedPost = await this.getPostById(postId, myId);

        let mentionedUsernames: string[] | null = null;
        let savedHashtags: string[] | null = null;

        const usernames = dto.mention ? extract(dto.mention, "mention") : null;
        await this.mentionService.removePostMentions(postId);
        if (usernames) {
            mentionedUsernames = await this.mentionService.savePostMention(usernames, postId);
        }
        const hashtags = dto.caption ? extract(dto.caption, "hashtag") : null;
        await this.hashtagService.removePostHashtags(postId);
        if (hashtags) {
            savedHashtags = await this.hashtagService.savePostHashtags(postId, hashtags)
        }
        return { updatedPost, mentionedUsernames, savedHashtags }
    }

    async getFollowingPosts(usersId: string[], offset: number, limit: number, sort: string) {
        return await this.postRepo.getFollowingPosts(usersId, offset, limit, sort);
    }
}