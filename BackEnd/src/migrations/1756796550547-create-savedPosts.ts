import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSavedPosts1756796550547 implements MigrationInterface {
    name = 'CreateSavedPosts1756796550547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saved_posts" ("userId" uuid NOT NULL, "postId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d3790479b4ace0798f7d54c551" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_4704fa96cd2b591592a8cfaee56" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_2a6ac38aa1767f692d4f492639b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_2a6ac38aa1767f692d4f492639b"`);
        await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_4704fa96cd2b591592a8cfaee56"`);
        await queryRunner.query(`DROP TABLE "saved_posts"`);
    }

}
