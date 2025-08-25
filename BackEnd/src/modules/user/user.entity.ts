import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SessionEntity } from "../auth/session.entity";
import { PostEntity } from "../post/post.entity";

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

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions!: SessionEntity[]

  @OneToMany(() => PostEntity, (post) => post.user)
  posts!: PostEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}