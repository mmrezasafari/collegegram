import { DataSource, Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { Tag } from "./model/tag";


export interface IHashtagRepository {
    saveHashtag(userId: string, postId: string):Promise<Tag | null>
}

export class HashtagRepository implements IHashtagRepository {
  tagRepository: Repository<TagEntity>;
  constructor(appDataSource: DataSource) {
    this.tagRepository = appDataSource.getRepository(TagEntity);
  }
  
  async saveHashtag(postId: string, context: string){
    return await this.tagRepository.save({
        postId,
        context
    })
  }
}