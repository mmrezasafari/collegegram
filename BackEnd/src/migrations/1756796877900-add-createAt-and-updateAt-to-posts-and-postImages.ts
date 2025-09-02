import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreateAtAndUpdateAtToPostsAndPostImages1756796877900 implements MigrationInterface {
    name = 'AddCreateAtAndUpdateAtToPostsAndPostImages1756796877900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_images" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "post_images" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "post_images" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "post_images" DROP COLUMN "createdAt"`);
    }

}
