import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity{
    // @PrimaryColumn()
    // id!: string
    
    @PrimaryColumn()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}