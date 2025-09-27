import { DataSource, Repository } from "typeorm";
import { SavedPostEntity } from "./saved-posts.entity";
import { SavePost } from "./models/saved-post";


export interface ISaveRepository {
  isSaved(postId:string,userId:string):Promise<SavePost | null>;
  save(postId:string,userId:string):Promise<SavePost>;
  unSave(postId: string, userId: string):Promise<null>;
  countSave(postId:string):Promise<number | null>;
  getSavePage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC"): Promise<SavedPostEntity[]>;
}

export class SaveRepository implements ISaveRepository {
  saveRepository: Repository<SavedPostEntity>;
  constructor(appDataSource: DataSource) {
    this.saveRepository = appDataSource.getRepository(SavedPostEntity);
  }

  async isSaved(postId: string, userId: string) {
    return await this.saveRepository.findOneBy({
      postId,
      userId
    })
  }

  async save(postId: string, userId: string) {
    return await this.saveRepository.save({
      postId,
      userId
    });
  }

  async unSave(postId: string, userId: string) {
    await this.saveRepository.delete({
      postId,
      userId
    });
    return null;
  }

  async countSave(postId: string){
    return await this.saveRepository.countBy({
      postId
    });
  }

  async getSavePage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
    return await this.saveRepository.createQueryBuilder("save")
      .leftJoinAndSelect("save.post", "post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.user", "user")
      .where("save.userId = :userId", { userId })
      .orderBy("save.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getMany();;
  }

}

