import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "../post/post.entity";
import { UserEntity } from "../user/user.entity";

@Entity("saved_posts")
export class SavedPostEntity {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  postId!: string;

  @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  post!: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.likedPosts, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}