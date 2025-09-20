import { DataSource, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { Comment } from "./model/comment";


export interface ICommentRepository {
  comment(postId:string, userId:string, content:string):Promise<Comment>;
  getById(commentId:string):Promise<Comment | null>;
  replyComment(postId:string, userId:string, content:string, parentId:string):Promise<Comment>;
  getComments(postId: string):Promise<Comment[] | null>;
  getReplies(commentId:string):Promise<Comment[] | null>;
  countComment(postId: string):Promise<number | null>;
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
  
  async getComments(postId: string){
    return await this.commentRepository.find({
    where:[
        {postId: postId, parentId:undefined},
        {postId: postId, parent:{parentId:undefined}}
    ],
    order: {
    createdAt: "ASC" 
  }
    });
  }

  async getReplies(commentId:string){
    const replies = await this.commentRepository.find({
    where:[
        {parentId:commentId}
    ],
    order: {
    createdAt: "ASC" 
  }
    });
  return replies.length > 0 ? replies : null;
  }

  async countComment(postId: string) {
    return await this.commentRepository.countBy({
      postId
    });

  }

}
