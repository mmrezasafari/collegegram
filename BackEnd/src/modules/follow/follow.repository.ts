import { DataSource, Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";
import { Follow } from "./models/follow";

export interface IFollowRepository {
  createFollow(followerId: string, followingId: string): Promise<Follow | null>;
  deleteFollow(followerId: string, followingId: string): Promise<null>;
  getFollows(userId: string, type: "followers" | "followings"): Promise<Follow[] | null>;
  isFollowing(followerId: string, followingId: string): Promise<Follow | null>;
  countFollow(userId: string, type: "followers" | "followings"): Promise<number | null>;


}
export class FollowRepository implements IFollowRepository {
  followRepository: Repository<FollowEntity>;
  constructor(appDataSource: DataSource) {
    this.followRepository = appDataSource.getRepository(FollowEntity);
  }

  async createFollow(followerId: string, followingId: string) {
    return await this.followRepository.save({
      followerId,
      followingId
    });
  }

  async deleteFollow(followerId: string, followingId: string) {
    await this.followRepository.delete({
      followerId,
      followingId
    });
    return null;
  }

  async getFollows(userId: string, type: "followers" | "followings") {
    if (type === "followers") {
      return await this.followRepository.find({
        where: {
          followingId: userId,
        },
        relations: {
          follower: true,
        },
        order: {
          createdAt: "desc"
        }
      })
    } else {
      return await this.followRepository.find({
        where: {
          followerId: userId,
        },
        relations: {
          following: true
        },
        order: {
          createdAt: "desc"
        }
      })
    }
  }
  async isFollowing(followerId: string, followingId: string): Promise<Follow | null> {
    return await this.followRepository.findOneBy({
      followerId,
      followingId

    })
  }
  async countFollow(userId: string, type: "followers" | "followings") {
    if (type === "followers") {
      return await this.followRepository.countBy({
        followingId: userId,
      });
    } else {
      return await this.followRepository.countBy({
        followerId: userId,
      });
    }
  }
}