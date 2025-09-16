import { DataSource, Repository } from "typeorm";
import { SavedPostEntity } from "./saved-posts.entity";
import { SavePost } from "./models/saved-post";
import { SavedPost } from "./models/save-page";


export interface ISaveRepository {
  isSaved(postId:string,userId:string):Promise<SavePost | null>;
  save(postId:string,userId:string):Promise<SavePost>;
  unSave(postId: string, userId: string):Promise<null>;
  countSave(postId:string):Promise<number | null>;
  getSavePage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC"): Promise<SavedPost[]>;
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
    const saves = await this.saveRepository.createQueryBuilder("save")
      .leftJoinAndSelect("save.post", "post")
      .leftJoinAndSelect("post.images", "images")
      .where("save.userId = :userId", { userId })
      .orderBy("save.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getMany();

    const posts = saves.map((m) => ({
      id: m.post.id,
      caption: m.post.caption,
      images: m.post.images.map((img) => ({
        id: img.id,
        url: img.url,
      })),
    }));

    return posts;
  }

}

