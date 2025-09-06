import { HttpError } from "../../../utility/http-error";
import { UserService } from "../user/user.service";
import { GetFollowsResponseDto } from "./dto/get-follows-response.dto";
import { FollowRepository } from "./follow.repository";
import { Follow } from "./models/follow";

export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userService: UserService
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
}