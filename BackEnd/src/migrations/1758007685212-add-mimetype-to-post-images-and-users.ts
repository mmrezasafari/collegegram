import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMimetypeToPostImagesAndUsers1758007685212 implements MigrationInterface {
    name = 'AddMimetypeToPostImagesAndUsers1758007685212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."post_images_mimetype_enum" AS ENUM('image/jpeg', 'image/apng', 'image/png', 'image/svg+xml')`);
        await queryRunner.query(`ALTER TABLE "post_images" ADD "mimeType" "public"."post_images_mimetype_enum" NOT NULL DEFAULT 'image/jpeg'`);
        await queryRunner.query(`CREATE TYPE "public"."users_mimetype_enum" AS ENUM('image/jpeg', 'image/apng', 'image/png', 'image/svg+xml')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mimeType" "public"."users_mimetype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mimeType"`);
        await queryRunner.query(`DROP TYPE "public"."users_mimetype_enum"`);
        await queryRunner.query(`ALTER TABLE "post_images" DROP COLUMN "mimeType"`);
        await queryRunner.query(`DROP TYPE "public"."post_images_mimetype_enum"`);
    }

}
