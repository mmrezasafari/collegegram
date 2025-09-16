import { AfterLoad, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SessionEntity } from "../auth/session.entity";
import { PostEntity } from "../post/post.entity";
import { MentionEntity } from "../mention/mention.entity";
import { LikeEntity } from "../like/like.entity";
import { SavedPostEntity } from "../savedPost/saved-posts.entity";
import { FollowEntity } from "../follow/follow.entity";
import { CommentEntity } from "../comment/comment.entity";
import { minioClient } from "../../config/minio.config";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true, type: "text" })
  bio?: string;

  @Column({ nullable: true })
  imagePath?: string;

  @Column({ nullable: true, type: "enum", enum: ImageMimeType })
  mimeType?: ImageMimeType;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions!: SessionEntity[]

  @OneToMany(() => PostEntity, (post) => post.user)
  posts!: PostEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MentionEntity, (mention) => mention.user)
  mentions!: MentionEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likedPosts!: LikeEntity[];

  @OneToMany(() => SavedPostEntity, (savedPost) => savedPost.user)
  savedPosts!: SavedPostEntity[];

  //کاربرانی که این یوزر رو فالو کردن 
  @OneToMany(() => FollowEntity, (follow) => follow.following)
  following!: FollowEntity[];

  //کاربرانی که این یوزر فالو کرده
  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followers!: FollowEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: CommentEntity[];
  @AfterLoad()
  async getUrlFromMinio() {
    if (this.imagePath) {
      this.imagePath = await minioClient.presignedGetObject(
        "profile-image",
        this.imagePath,
        3600,
        {
          "response-content-disposition": "inline",
          "response-content-type": this.mimeType ?? "image/jpeg"
        }
      );
    }
  }

}