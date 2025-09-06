
import { LikeService } from "./like/like.service";
import { PostService } from "./post/post.service";
import { UserService } from "./user/user.service";
import { MentionService } from "./mention/mention.service";
import { SaveService } from "./savedPost/saved-post.service";


export class FeedService {
    constructor(
        private userService: UserService,
        private postService: PostService,
        private mentionService: MentionService,
        private likeService: LikeService,
        private saveService: SaveService
    ) { }

    async getPost(postId: string, userId: string){
        const existuser = await this.userService.getUser(userId);
        const user = {
            username: existuser.username,
            imagePath: existuser.imagePath
        };
        const existpost = await this.postService.getPostById(postId);
        const post = {
            caption: existpost.caption,
            images: existpost.images,
            createdAt: existpost.createdAt,
        };
        const mentionedUsernames = await this.mentionService.getMentionedUsernames(postId);

        const likeCount = await this.likeService.getLikesCount(postId);
        const liked = await this.likeService.liked(postId, userId);

        const saveCount = await this.saveService.getSaveCount(postId);
        const saved = await this.saveService.saved(postId, userId);

        return{user, post, mentionedUsernames,likeCount, liked, saveCount, saved}
    }
}