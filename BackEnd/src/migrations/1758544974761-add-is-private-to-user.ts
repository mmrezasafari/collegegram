import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPrivateToUser1758544974761 implements MigrationInterface {
    name = 'AddIsPrivateToUser1758544974761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isPrivate"`);
    }

}
