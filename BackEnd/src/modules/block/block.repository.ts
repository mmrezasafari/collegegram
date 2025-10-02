import { DataSource, Repository } from "typeorm";
import { BlockEntity } from "./block.entity";
import { Block } from "./models/block";
import { User } from "../user/model/user";


export interface IBlockRepository {
  block(userId: string, blockedUserId: string): Promise<Block | null>;
  blocked(userId: string, blockedUserId: string): Promise<Block | null>;
  unblock(userId: string, blockedUserId: string): Promise<null>;
  getBlockedUsers(userId: string): Promise<User[]> 
}

export class BlockRepository implements IBlockRepository {
  blockRepository: Repository<BlockEntity>;
  constructor(appDataSource: DataSource) {
    this.blockRepository = appDataSource.getRepository(BlockEntity);
  }

  async block(userId: string, blockedUserId: string) {
    return await this.blockRepository.save({
      userId, blockedUserId
    })
  }

  async blocked(userId: string, blockedUserId: string) {
    return await this.blockRepository.findOne({
      where: { userId, blockedUserId },
    })
  }

  async unblock(userId: string, blockedUserId: string) {
    await this.blockRepository.delete({
      userId,
      blockedUserId
    });
    return null;
  }
  async getBlockedUsers(userId: string) {
  const blocks = await this.blockRepository.find({
    where: { userId },
    relations: ["blockedUser"],
  });

  return blocks.map(block => block.blockedUser);
}

}