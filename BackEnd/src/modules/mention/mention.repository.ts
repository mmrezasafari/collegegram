import { DataSource, Repository } from "typeorm";
import { MentionEntity } from "./mention.entity";
import { Mention } from "./models/mention";


export interface IMentionRepository {
    saveMention(userId: string, postId: string):Promise<Mention | null>
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
}