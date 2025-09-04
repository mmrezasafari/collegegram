import { DataSource, Repository } from "typeorm";
import { LikeEntity } from "./like.entity";
import { Like } from "./models/like";


export interface ILikeRepository {
  liked(postId:string,userId:string):Promise<Like | null>;
  like(postId:string,userId:string):Promise<Like>;
  unLike(postId: string, userId: string):Promise<null>;
  countLike(postId:string):Promise<number | null>;
}

export class LikeRepository implements ILikeRepository {
  likeRepository: Repository<LikeEntity>;
  constructor(appDataSource: DataSource) {
    this.likeRepository = appDataSource.getRepository(LikeEntity);
  }

  async liked(postId: string, userId: string) {
    return await this.likeRepository.findOneBy({
      postId,
      userId
    })
  }

  async like(postId: string, userId: string) {
    return await this.likeRepository.save({
      postId,
      userId
    });
  }

  async unLike(postId: string, userId: string) {
    await this.likeRepository.delete({
      postId,
      userId
    });
    return null;
  }

  async countLike(postId: string){
    return await this.likeRepository.countBy({
      postId
    });

  }
}
