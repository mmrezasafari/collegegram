import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  postId!: string;

  @Column()
  userId!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, {  onDelete: "CASCADE", onUpdate: "CASCADE" })
  post!: PostEntity;
  
  @ManyToOne(() => UserEntity, (user) => user.comments, {  onDelete: "CASCADE", onUpdate: "CASCADE"  })
  user!: UserEntity;

  @ManyToOne(() => CommentEntity, (comments) => comments.replies, { nullable: true, onDelete: "CASCADE" })
  parent?: CommentEntity;

  @OneToMany(() => CommentEntity, (comments) => comments.parent)
  replies?: CommentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
