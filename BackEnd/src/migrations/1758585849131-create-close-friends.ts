import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCloseFriends1758585849131 implements MigrationInterface {
    name = 'CreateCloseFriends1758585849131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "close_friends" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "friendId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a80561a5fe66a66045c2e0753fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "onlyCloseFriends" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "close_friends" ADD CONSTRAINT "FK_c3805e69a56f34fced5623e546c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "close_friends" ADD CONSTRAINT "FK_c67276c983ac89450361a04c1e4" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "close_friends" DROP CONSTRAINT "FK_c67276c983ac89450361a04c1e4"`);
        await queryRunner.query(`ALTER TABLE "close_friends" DROP CONSTRAINT "FK_c3805e69a56f34fced5623e546c"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "onlyCloseFriends"`);
        await queryRunner.query(`DROP TABLE "close_friends"`);
    }

}
