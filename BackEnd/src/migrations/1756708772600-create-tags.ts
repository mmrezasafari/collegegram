import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTags1756708772600 implements MigrationInterface {
    name = 'CreateTags1756708772600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "context" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_tags_tags" ("postId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_0102fd077ecbe473388af8f3358" PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf364c7e6905b285c4b55a0034" ON "posts_tags_tags" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce163a967812183a51b044f740" ON "posts_tags_tags" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_cf364c7e6905b285c4b55a00343" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_ce163a967812183a51b044f7404" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_ce163a967812183a51b044f7404"`);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_cf364c7e6905b285c4b55a00343"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce163a967812183a51b044f740"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf364c7e6905b285c4b55a0034"`);
        await queryRunner.query(`DROP TABLE "posts_tags_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
