import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToFollow1758616666019 implements MigrationInterface {
    name = 'AddStatusToFollow1758616666019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."follows_status_enum" AS ENUM('PENDING', 'ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "follows" ADD "status" "public"."follows_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."follows_status_enum"`);
    }

}
