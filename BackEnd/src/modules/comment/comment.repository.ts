import { DataSource, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { Comment } from "./model/comment";


export interface ICommentRepository {
  comment(postId:string, userId:string, content:string):Promise<Comment>;
  getById(commentId:string):Promise<Comment | null>;
  replyComment(postId:string, userId:string, content:string, parentId:string):Promise<Comment>;
//   getComments(postId: string):Promise<Comment[] | null>;
}

export class CommentRepository implements ICommentRepository {
  commentRepository: Repository<CommentEntity>;
  constructor(appDataSource: DataSource) {
    this.commentRepository = appDataSource.getRepository(CommentEntity);
  }

  async comment(postId:string, userId:string, content:string){
    return await this.commentRepository.save({
      postId,
      userId,
      content
    })
  }

  async getById(commentId:string){
    return await this.commentRepository.findOneBy({ id: commentId });
  }

  async replyComment(postId:string, userId:string, content:string, parentId:string) {
    return await this.commentRepository.save({
      postId,
      userId,
      content,
      parentId
    });
  }
  
//   getComments(postId: string){

//   }
  
}
