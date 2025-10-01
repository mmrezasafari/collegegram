import { DataSource, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { Comment } from "./model/comment";
import { DeleteResult } from "typeorm";


export interface ICommentRepository {
  comment(postId: string, userId: string, content: string): Promise<Comment>;
  getById(commentId: string): Promise<Comment | null>;
  replyComment(postId: string, userId: string, content: string, parentId: string): Promise<Comment>;
  getComments(postId: string): Promise<Comment[] | null>;
  getReplies(commentId: string): Promise<Comment[] | null>;
  countComment(postId: string): Promise<number | null>;
  deleteUserCommentsFromUserPosts(pageOwnerId: string, commenterId: string):Promise<DeleteResult | null>;
}

export class CommentRepository implements ICommentRepository {
  commentRepository: Repository<CommentEntity>;
  constructor(appDataSource: DataSource) {
    this.commentRepository = appDataSource.getRepository(CommentEntity);
  }

  async comment(postId: string, userId: string, content: string) {
    return await this.commentRepository.save({
      postId,
      userId,
      content
    })
  }

  async getById(commentId: string) {
    return await this.commentRepository.findOne({
      where: {
        id: commentId
      }
      ,
      relations: {
        post: {
          user: true
        }
      }

    });
  }

  async replyComment(postId: string, userId: string, content: string, parentId: string) {
    return await this.commentRepository.save({
      postId,
      userId,
      content,
      parentId
    });
  }

  async getComments(postId: string) {
    return await this.commentRepository.find({
      where: [
        { postId: postId, parentId: undefined },
        { postId: postId, parent: { parentId: undefined } }
      ],
      order: {
        createdAt: "ASC"
      }
    });
  }

  async getReplies(commentId: string) {
    const replies = await this.commentRepository.find({
      where: [
        { parentId: commentId }
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

  async deleteUserCommentsFromUserPosts(pageOwnerId: string, commenterId: string) {
    const comments = await this.commentRepository.find({
      where: {
        userId : commenterId,
        post: {
          user: {
            id: pageOwnerId,
          }
        }
      }
    })
    if (comments.length > 0) {
    const ids = comments.map(c => c.id);  // get primary keys
    return await this.commentRepository.delete(ids);
  }

  return null;
    }
  //   return await this.commentRepository.createQueryBuilder()
  // .delete()
  // .from(CommentEntity, "comment")
  // .where("userId = :userId", { commenterId })
  // .andWhere(`postId IN (
  //   SELECT id FROM posts WHERE "userId" = :pageOwnerId
  // )`, { pageOwnerId })
  // .execute();
  

}
