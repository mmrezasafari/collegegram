import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";

@Entity("post_images")
export class PostImagesEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  path!: string;

  @ManyToOne(() => PostEntity, (post) => post.images)
  post!: PostEntity;


}