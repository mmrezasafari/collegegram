import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";

@Entity("post_images")
export class PostImagesEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  url!: string;

  @Column({ type: "enum", enum: ImageMimeType, default: ImageMimeType.jpeg })
  mimeType!: ImageMimeType;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  post!: PostEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @AfterLoad()
  async getUrlFromMinio() {
    this.url = `${process.env.MINIO_HOST}/posts/${this.url}`;
  }
}