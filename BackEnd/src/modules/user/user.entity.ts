import { AfterLoad, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SessionEntity } from "../auth/session.entity";
import { PostEntity } from "../post/post.entity";
import { MentionEntity } from "../mention/mention.entity";
import { LikeEntity } from "../like/like.entity";
import { SavedPostEntity } from "../savedPost/saved-posts.entity";
import { FollowEntity } from "../follow/follow.entity";
import { CommentEntity } from "../comment/comment.entity";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";
import { CloseFriendEntity } from "../closeFriend/close-friend.entity";
import { NotificationEntity } from "../notification/notification.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
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

  @Column({ default: false })
  isPrivate!: boolean;

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
    this.imagePath = `${process.env.FRONTEND_HOST}/files/profile-image/${this.imagePath}`;
  }

  @OneToMany(() => CloseFriendEntity, cf => cf.user)
  closeFriends!: CloseFriendEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.receiver)
  notifications!: NotificationEntity[];

}