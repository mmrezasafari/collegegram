import { DataSource, Repository } from "typeorm";
import { MentionEntity } from "./mention.entity";
import { Mention } from "./models/mention";


export interface IMentionRepository {
    saveMention(userId: string, postId: string):Promise<Mention | null>;
    getUsernames(postId: string): Promise<string[]>;
}

export class MentionRepository implements IMentionRepository {
  mentionRepository: Repository<MentionEntity>;
  constructor(appDataSource: DataSource) {
    this.mentionRepository = appDataSource.getRepository(MentionEntity);
  }
  
  async saveMention(userId: string, postId: string){
    return await this.mentionRepository.save({
        postId,
        userId
    })
  }

  async getUsernames(postId: string): Promise<string[]> {
    const rows = await this.mentionRepository
      .createQueryBuilder("mention")
      .innerJoin("mention.user", "user")
      .select("user.username", "username")
      .where("mention.postId = :postId", { postId })
      .getRawMany();

    return rows.map(r => r.username);
  }
}