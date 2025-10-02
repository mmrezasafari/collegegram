import { DataSource, Repository } from "typeorm";
import { BlockEntity } from "./block.entity";
import { Block } from "./models/block";


export interface IBlockRepository {
  block(userId: string, blockedUserId: string): Promise<Block | null>;
  blocked(userId: string, blockedUserId: string): Promise<Block | null>;
  unblock(userId: string, blockedUserId: string): Promise<null>;
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


}