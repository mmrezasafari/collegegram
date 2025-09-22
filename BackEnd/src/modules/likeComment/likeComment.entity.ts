import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { UserEntity } from "../user/user.entity";

@Entity("likeComment")
export class LikeCommentEntity {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  commentId!: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  comment!: CommentEntity;

  @ManyToOne(() => UserEntity, (user) => user.likedPosts, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}