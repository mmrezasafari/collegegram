import { HttpError } from "../../../utility/http-error";
import { UserService } from "../user/user.service";
import { FollowRepository } from "./follow.repository";

export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userService: UserService
  ) { }
  async followUser(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    if (!following) {
      throw new HttpError(404, "کاربر یافت نشد")
    }
    const userExists = await this.followRepository.isFollowing(followerId, following.id);
    if (userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال می‌کردید")
    }
    return await this.followRepository.createFollow(followerId, following.id)
  }
  async unfollowUser(followerId: string, username: string) {
    const following = await this.userService.getUserByUsername(username);
    if (!following) {
      throw new HttpError(404, "کاربر یافت نشد")
    }
    const userExists = await this.followRepository.isFollowing(followerId, following.id);
    if (!userExists) {
      throw new HttpError(400, "شما این کاربر را دنبال نمی‌کردید")
    }
    return await this.followRepository.deleteFollow(followerId, following.id)
  }
}