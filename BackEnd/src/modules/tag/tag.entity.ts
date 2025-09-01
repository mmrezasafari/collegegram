import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "../post/post.entity";

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