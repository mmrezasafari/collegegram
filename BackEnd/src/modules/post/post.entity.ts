import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostImagesEntity } from "./post-images.entity";

@Entity("posts")
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  caption?: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { eager: true })
  user!: UserEntity;

  @OneToMany(() => PostImagesEntity, (image) => image.post, { cascade: ['insert'], eager: true })
  images!: PostImagesEntity[];

}