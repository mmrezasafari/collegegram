
import { LikeService } from "./like/like.service";
import { PostService } from "./post/post.service";
import { UserService } from "./user/user.service";
import { MentionService } from "./mention/mention.service";
import { SaveService } from "./savedPost/saved-post.service";
import { Post } from "./post/model/post";
import { HttpError } from "../../utility/http-error";
import { CommentService } from "./comment/comment.service";


export class FeedService {
    constructor(
        private userService: UserService,
        private postService: PostService,
        private mentionService: MentionService,
        private likeService: LikeService,
        private saveService: SaveService,
        private commentService: CommentService
    ) { }

    async getPost(postId: string, userId: string) {
        const existPost: Post = await this.postService.getPostById(postId);
        if (!existPost) {
            throw new HttpError(404, "پست یافت نشد");
        }
        existPost.images = existPost.images.map(image => {
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
            return { ...image, fileName };
        });
        const post = {
            username: existPost.user?.username,
            profileImage: existPost.user?.imagePath,
            firstName: existPost.user?.firstName,
            lastName: existPost.user?.lastName,
            caption: existPost.caption,
            images: existPost.images,
            createdAt: existPost.createdAt,
        };
        const mentionedUsernames = await this.mentionService.getMentionedUsernames(postId);

        const likeCount = await this.likeService.getLikesCount(postId);
        const liked = await this.likeService.liked(postId, userId);

        const saveCount = await this.saveService.getSaveCount(postId);
        const saved = await this.saveService.saved(postId, userId);

        const commentCount = await this.commentService.getCommentCount(postId);

        return {post, mentionedUsernames, likeCount, liked, saveCount, saved, commentCount }
    }
}