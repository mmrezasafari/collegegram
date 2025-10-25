import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";
import { NotificationType } from "./notification-type.enum";
import { CommentEntity } from "../comment/comment.entity";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  receiverId!: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "receiverId" })
  receiver!: UserEntity;

  @Column()
  actorId!: string;

  @ManyToOne(() => UserEntity, { eager: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
  actor!: UserEntity;

  @Column({ type: "enum", enum: NotificationType })
  type!: NotificationType;

  @Column({ nullable: true })
  postId?: string;

  @ManyToOne(() => PostEntity, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
  post?: PostEntity;

  @Column({ nullable: true })
  commentId?: string;

  @ManyToOne(() => CommentEntity, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
  comment?: CommentEntity;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
