import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMentions1756795192081 implements MigrationInterface {
    name = 'CreateMentions1756795192081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mentions" ("userId" uuid NOT NULL, "postId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b8b757a58bd688e68af24278a2" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`ALTER TABLE "mentions" ADD CONSTRAINT "FK_aea5dc844133160ab72e5bf24f6" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mentions" ADD CONSTRAINT "FK_111b6998e2d136029f80936fc02" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentions" DROP CONSTRAINT "FK_111b6998e2d136029f80936fc02"`);
        await queryRunner.query(`ALTER TABLE "mentions" DROP CONSTRAINT "FK_aea5dc844133160ab72e5bf24f6"`);
        await queryRunner.query(`DROP TABLE "mentions"`);
    }

}
