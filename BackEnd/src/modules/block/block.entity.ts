import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity('block')
export class BlockEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  blockedUserId!: string;

  @ManyToOne(() => UserEntity, (user) => user.closeFriends, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  blockedUser!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
