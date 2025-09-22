import { DataSource, Repository } from "typeorm";
import { LikeComment } from "./models/likeComment";
import { LikeCommentEntity } from "./likeComment.entity";


export interface ILikeCommentRepository {
  isLiked(commentId:string,userId:string):Promise<LikeComment | null>;
  like(commentId:string,userId:string):Promise<LikeComment>;
  unLike(commentId: string, userId: string):Promise<null>;
  countLike(commentId:string):Promise<number>;
}

export class LikeCommentRepository implements ILikeCommentRepository {
  likeCommentRepository: Repository<LikeCommentEntity>;
  constructor(appDataSource: DataSource) {
    this.likeCommentRepository = appDataSource.getRepository(LikeCommentEntity);
  }

  async isLiked(commentId: string, userId: string) {
    return await this.likeCommentRepository.findOneBy({
      commentId,
      userId
    })
  }

  async like(commentId: string, userId: string) {
    return await this.likeCommentRepository.save({
      commentId,
      userId
    });
  }

  async unLike(commentId: string, userId: string) {
    await this.likeCommentRepository.delete({
      commentId,
      userId
    });
    return null;
  }

  async countLike(commentId: string){
    return await this.likeCommentRepository.countBy({
      commentId
    });

  }
}
