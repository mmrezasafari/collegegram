import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("passwords_token")
export class PasswordTokenEntity {
  @PrimaryGeneratedColumn("uuid")
  token!: string;

  @Column()
  expireDate!: Date;

  @OneToOne(() => UserEntity, (user) => user.passwordToken, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}