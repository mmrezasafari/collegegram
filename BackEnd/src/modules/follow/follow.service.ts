import { HttpError } from "../../../utility/http-error";
import { NotificationType } from "../notification/notification-type.enum";
import { NotificationService } from "../notification/notification.service";
import { UserService } from "../user/user.service";
import { GetFollowsResponseDto } from "./dto/get-follows-response.dto";
import { FollowStatusEnum } from "./follow-status.enum";
import { FollowRepository } from "./follow.repository";
import { Follow } from "./models/follow";

export interface IFollowService {
  followUserAndCreateNotification(followerId: string, username: string): Promise<Follow>;
  unfollowUser(followerId: string, username: string): Promise<null>;
  getFollowers(userId: string, username: string): Promise<GetFollowsResponseDto[]>;
  getFollowings(userId: string, username: string): Promise<GetFollowsResponseDto[]>;
  countFollow(userId: string, type: "followers" | "followings"): Promise<number>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}
export class FollowService implements IFollowService {
  constructor(
    private followRepository: FollowRepository,
    private userService: UserService,
    private notificationService: NotificationService
  ) { }
  async followUserAndCreateNotification(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    const userExists = await this.followRepository.isFollowing(followerId, following.id);
    if (userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال می‌کردید")
    }
    const user = await this.userService.getUser(following.id);
    if (user.isPrivate) {
      const follow = await this.followRepository.createFollow(followerId, following.id, FollowStatusEnum.PENDING);
      await this.notificationService.createNotification(following.id, followerId, NotificationType.FOLLOW_REQUEST);
      return follow;
    }
    const follow = await this.followRepository.createFollow(followerId, following.id, FollowStatusEnum.ACCEPTED);
    await this.notificationService.createNotification(following.id, followerId, NotificationType.FOLLOW);
    return follow;
  }
  async unfollowUser(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    const userExists = await this.followRepository.getFollowById(followerId, following.id);
    if (!userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال نمی‌کردید")
    }
    return await this.followRepository.deleteFollow(followerId, following.id)
  }
  async getFollowers(userId: string, username: string): Promise<GetFollowsResponseDto[]> {
    const user = await this.userService.getUserByUsername(username);
    const canAccess = await this.userService.canAccessResource(userId, user.id);
    if (!canAccess) {
      throw new HttpError(403, "شما اجازه دسترسی به این کاربر را ندارید")
    }
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
    const canAccess = await this.userService.canAccessResource(userId, user.id);
    if (!canAccess) {
      throw new HttpError(403, "شما اجازه دسترسی به این کاربر را ندارید")
    }
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

  async getFollows(userId: string, type: "followers" | "followings") {
    return await this.followRepository.getFollows(userId, type);

  }

  async respondToFollowRequestsAndCreateNotification(userId: string, username: string, accept: boolean) {
    const follower = await this.userService.getUserByUsername(username);
    if (!follower) {
      throw new HttpError(404, "کاربر مورد نظر یافت نشد")
    }
    const followRequest = await this.followRepository.getFollowById(follower.id, userId);

    if (!followRequest) {
      throw new HttpError(404, "درخواست دنبال کردن یافت نشد")
    }
    if (followRequest.status !== FollowStatusEnum.PENDING) {
      throw new HttpError(400, "شما این کاربر را دنبال می‌کنید")
    }
    if (accept) {
      followRequest.status = FollowStatusEnum.ACCEPTED;
      await this.followRepository.updateFollow(followRequest);
      await this.notificationService.createNotification(userId, follower.id, NotificationType.FOLLOW_ACCEPTED);
    } else {
      await this.followRepository.deleteFollow(follower.id, userId)
      const notification = await this.notificationService.getNotification(userId, follower.id, NotificationType.FOLLOW_REQUEST);
      await this.notificationService.deleteNotification(notification.id);
    }
    return null;
  }

  async getStatusFollowRequest(userId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    const follow = await this.followRepository.getFollowById(userId, following.id);
    if (!follow) {
      return { status: "NONE" }
    } else if (follow.status === FollowStatusEnum.PENDING) {
      return { status: "PENDING" }
    }
    return { status: "ACCEPTED" }
  }
}