import { DataSource, Repository } from "typeorm";
import { CloseFriendEntity } from "./close-friend.entity";
import { CloseFriend } from "./models/closeFriend";


export interface ICloseFriendRepository {
  existsCloseFriend(userId: string, friendId: string): Promise<CloseFriendEntity | null>;
  addCloseFriend(userId: string, friendId: string): Promise<CloseFriend | null>;
  removeCloseFriend(userId: string, friendId: string): Promise<null>;
  getCloseFriends(userId: string): Promise<CloseFriendEntity[]>
}

export class CloseFriendRepository implements ICloseFriendRepository {
  closeFriendRepository: Repository<CloseFriendEntity>;
  constructor(appDataSource: DataSource) {
    this.closeFriendRepository = appDataSource.getRepository(CloseFriendEntity);
  }

  async existsCloseFriend(userId: string, friendId: string) {
    return await this.closeFriendRepository.findOne({
      where: { userId, friendId },
    })
  }

  async addCloseFriend(userId: string, friendId: string) {
    return await this.closeFriendRepository.save({
      userId,
      friendId
    })
  }

  async removeCloseFriend(userId: string, friendId: string) {
    await this.closeFriendRepository.delete({
      userId,
      friendId
    });
    return null;
  }

  async getCloseFriends(userId: string) {
    return await this.closeFriendRepository.find({
      where: {userId },
      relations: ['friend'],
    });
  }

}