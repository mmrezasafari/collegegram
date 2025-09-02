import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Entity("mentions")
export class MentionEntity {
    @PrimaryColumn()
    userId!: string;

    @PrimaryColumn()
    postId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => PostEntity, (post) => post.mentions, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    post!: PostEntity;

    @ManyToOne(() => UserEntity, (user) => user.mentions, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    user!: UserEntity;

}
