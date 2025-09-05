import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostImagesEntity } from "./post-images.entity";
import { TagEntity } from "../tag/tag.entity";
import { MentionEntity } from "../mention/mention.entity";
import { LikeEntity } from "../like/like.entity";
import { SavedPostEntity } from "../savedPost/saved-posts.entity";

@Entity("posts")
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  caption?: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: UserEntity;

  @OneToMany(() => PostImagesEntity, (image) => image.post, { cascade: true, eager: true })
  images!: PostImagesEntity[];

  @ManyToMany(() => TagEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable()
  tags!: TagEntity[];

  @OneToMany(() => MentionEntity, (mention) => mention.post)
  mentions!: MentionEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes!: LikeEntity[];

  @OneToMany(() => SavedPostEntity, (savedPost) => savedPost.post)
  savedPosts!: SavedPostEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}