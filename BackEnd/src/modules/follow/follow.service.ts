import { HttpError } from "../../../utility/http-error";
import { CommentService } from "../comment/comment.service";
import { LikeService } from "../like/like.service";
import { PostService } from "../post/post.service";
import { SaveService } from "../savedPost/saved-post.service";
import { UserService } from "../user/user.service";
import { GetFollowsResponseDto } from "./dto/get-follows-response.dto";
import { HomePageResponseDto } from "./dto/home-page-response";
import { FollowRepository } from "./follow.repository";
import { Follow } from "./models/follow";

export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private postService: PostService,
    private userService: UserService,
    private likeService: LikeService,
    private saveService: SaveService,
    private commentService: CommentService,
  ) { }
  async followUser(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    const userExists = await this.followRepository.isFollowing(followerId, following.id);
    if (userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال می‌کردید")
    }
    return await this.followRepository.createFollow(followerId, following.id)
  }
  async unfollowUser(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    const userExists = await this.followRepository.isFollowing(followerId, following.id);
    if (!userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال نمی‌کردید")
    }
    return await this.followRepository.deleteFollow(followerId, following.id)
  }
  async getFollowers(userId: string, username: string): Promise<GetFollowsResponseDto[]> {
    const user = await this.userService.getUserByUsername(username);
    //TODO When added private page

    // const follow = await this.followRepository.isFollowing(userId, user.id);
    // if (userId != user.id && !follow) {
    //   throw new HttpError(403, "شما این کاربر را دنبال نمی‌کنید")
    // }
    const follows = await this.followRepository.getFollows(user.id, "followers");
    const response = [];
    for (const follow of follows) {
      const followerCount = await this.followRepository.countFollow(follow.followerId, "followers");
      response.push({
        id: follow.followerId,
        username: follow.follower.username,
        firstName: follow.follower.firstName,
        lastName: follow.follower.lastName,
        imageUrl: follow.follower.imagePath,
        followerCount,
      })
    }
    return response;
  }
  async getFollowings(userId: string, username: string): Promise<GetFollowsResponseDto[]> {
    const user = await this.userService.getUserByUsername(username);
    //TODO When added private page

    // const follow = await this.followRepository.isFollowing(userId, user.id);
    // if (userId != user.id && !follow) {
    //   throw new HttpError(403, "شما این کاربر را دنبال نمی‌کنید")
    // }
    const follows = await this.followRepository.getFollows(user.id, "followings");

    const response = [];
    for (const follow of follows) {
      const followerCount = await this.followRepository.countFollow(follow.followingId, "followers");
      response.push({
        id: follow.followingId,
        username: follow.following.username,
        firstName: follow.following.firstName,
        lastName: follow.following.lastName,
        imageUrl: follow.following.imagePath,
        followerCount,
      })

    }
    return response;
  }
  async countFollow(userId: string, type: "followers" | "followings") {
    return await this.followRepository.countFollow(userId, type);
  }
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const following = await this.followRepository.isFollowing(followerId, followingId);
    return following ? true : false;
  }
  async getHomePage(userId: string, offset: number, limit: number, sort: string) {
    const followings = await this.followRepository.getFollows(userId, "followings")
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
      const followerCount = await this.countFollow(post.user.id, "followers");
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