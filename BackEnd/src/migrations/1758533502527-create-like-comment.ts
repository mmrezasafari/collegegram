import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLikeComment1758533502527 implements MigrationInterface {
    name = 'CreateLikeComment1758533502527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likeComment" ("userId" uuid NOT NULL, "commentId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4dd8cb56836dd41de57d1d454c6" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`ALTER TABLE "likeComment" ADD CONSTRAINT "FK_2830e7c88529da23ecea95043de" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likeComment" ADD CONSTRAINT "FK_0b3c1a27339e3b6dac45a958ae8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likeComment" DROP CONSTRAINT "FK_0b3c1a27339e3b6dac45a958ae8"`);
        await queryRunner.query(`ALTER TABLE "likeComment" DROP CONSTRAINT "FK_2830e7c88529da23ecea95043de"`);
        await queryRunner.query(`DROP TABLE "likeComment"`);
    }

}
