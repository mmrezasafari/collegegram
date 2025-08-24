import { Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("sessions")
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id !: string;

  @Column()
  @Generated("uuid")
  token!: string;

  @Column()
  expireDate!: Date;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}