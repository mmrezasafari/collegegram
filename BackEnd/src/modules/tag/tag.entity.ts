import { Column,CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("tags")
export class TagEntity {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  context!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}