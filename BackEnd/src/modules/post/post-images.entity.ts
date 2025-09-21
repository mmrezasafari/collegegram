import { AfterLoad, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { minioGetClient } from "../../config/minio.config";
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
    if (this.url) {
      this.url = await minioGetClient.presignedGetObject(
        "posts",
        this.url,
        3600,
        {
          "response-content-disposition": "inline",
          "response-content-type": this.mimeType
        }
      );
    }
  }
}