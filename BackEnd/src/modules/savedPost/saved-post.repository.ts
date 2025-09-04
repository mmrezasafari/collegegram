import { DataSource, Repository } from "typeorm";
import { SavedPostEntity } from "./saved-posts.entity";
import { SavePost } from "./models/saved-post";


export interface ISaveRepository {
  isSaved(postId:string,userId:string):Promise<SavePost | null>;
  save(postId:string,userId:string):Promise<SavePost>;
  unSave(postId: string, userId: string):Promise<null>;
  countSave(postId:string):Promise<number | null>;
}

export class SaveRepository implements ISaveRepository {
  SaveRepository: Repository<SavedPostEntity>;
  constructor(appDataSource: DataSource) {
    this.SaveRepository = appDataSource.getRepository(SavedPostEntity);
  }

  async isSaved(postId: string, userId: string) {
    return await this.SaveRepository.findOneBy({
      postId,
      userId
    })
  }

  async save(postId: string, userId: string) {
    return await this.SaveRepository.save({
      postId,
      userId
    });
  }

  async unSave(postId: string, userId: string) {
    await this.SaveRepository.delete({
      postId,
      userId
    });
    return null;
  }

  async countSave(postId: string){
    return await this.SaveRepository.countBy({
      postId
    });

  }
}

