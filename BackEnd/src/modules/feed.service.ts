
import { LikeService } from "./like/like.service";
import { PostService } from "./post/post.service";
import { UserService } from "./user/user.service";
import { MentionService } from "./mention/mention.service";
import { SaveService } from "./savedPost/saved-post.service";
import { Post } from "./post/model/post";
import { HttpError } from "../../utility/http-error";
import { CommentService } from "./comment/comment.service";
import { CloseFriendService } from "./closeFriend/close-friend.service";
import { FollowService } from "./follow/follow.service";
import { HomePageResponseDto } from "./follow/dto/home-page-response";


export class FeedService {
    constructor(
        private userService: UserService,
        private postService: PostService,
        private mentionService: MentionService,
        private likeService: LikeService,
        private saveService: SaveService,
        private commentService: CommentService,
        private closeFriendService: CloseFriendService,
        private followService: FollowService
    ) { }

    async getPost(postId: string, userId: string) {

        const existPost: Post = await this.postService.getPostById(postId, userId);
        if (!existPost) {
            throw new HttpError(404, "پست یافت نشد");
        }

        const canAccess = await this.userService.canAccessResource(userId, existPost.user!.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این پست را ندارید");
        }
        const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, existPost.user!.id);
        if (existPost.onlyCloseFriends && !isCloseFriend) {
            throw new HttpError(403, "شما اجازه دسترسی به این پست را ندارید");
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
            onlyCloseFriend: existPost.onlyCloseFriends,
            images: existPost.images,
            createdAt: existPost.createdAt,
        };
        const mentionedUsernames = await this.mentionService.getMentionedUsernames(postId);

        const likeCount = await this.likeService.getLikesCount(postId);
        const liked = await this.likeService.liked(postId, userId);

        const saveCount = await this.saveService.getSaveCount(postId);
        const saved = await this.saveService.saved(postId, userId);

        const commentCount = await this.commentService.getCommentCount(postId);

        return { post, mentionedUsernames, likeCount, liked, saveCount, saved, commentCount }
    }

    async getPosts(username: string, myId: string) {
        const user = await this.userService.getUserByUsername(username);

        const canAccess = await this.userService.canAccessResource(myId, user.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این کاربر را ندارید");
        }

        const isCloseFriend = await this.closeFriendService.isCloseFriend(myId, user.id);

        const posts = (await this.postService.getPosts(user.id)) ?? []; 

        const filteredPosts = posts.filter(post =>
            isCloseFriend ? true : !post.onlyCloseFriends
        );

        return filteredPosts;
    }

    async getHomePage(userId: string, offset: number, limit: number, sort: string) {
        const followings = await this.followService.getFollows(userId, "followings")
        if (!followings) {
          return [];
        }
        let followingsId = followings.map(following => following.followingId);
        const posts = await this.postService.getFollowingPosts(followingsId, offset, limit, sort);
        let data: HomePageResponseDto[] = [];
        if (!posts) {
          return [];
        }
        for (const post of posts) {
          if (!post.user) {
            throw new HttpError(500, "خطای سرور");
          }
          const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, post.user.id);
          if (post.onlyCloseFriends && !isCloseFriend) {
            continue;
          }
          const followerCount = await this.followService.countFollow(post.user.id, "followers");
          const likeCount = await this.likeService.getLikesCount(post.id);
          const isLiked = await this.likeService.liked(post.id, userId);
          const savedCount = await this.saveService.getSaveCount(post.id);
          const isSaved = await this.saveService.saved(post.id, userId);
          const commentCount = await this.commentService.getCommentCount(post.id);
          data.push({
            username: post.user.username,
            firstName: post.user.firstName,
            lastName: post.user.lastName,
            imagePath: post.user.imagePath,
            post: {
              id: post.id,
              images: post.images,
              caption: post.caption,
              onlyCloseFriends: post.onlyCloseFriends,
              createdAt: post.createdAt,
            },
            followerCount: followerCount ?? 0,
            likeCount: likeCount ?? 0,
            isLiked,
            savedCount: savedCount ?? 0,
            isSaved,
            commentCount: commentCount ?? 0
          })
        }
        return data;
      }
}