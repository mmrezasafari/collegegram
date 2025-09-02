import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("follows")

@Unique(["followerId", "followingId"])

export class FollowEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    followerId!: string;

    @Column()
    followingId!: string;

    @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    follower!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.following, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    following!: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}