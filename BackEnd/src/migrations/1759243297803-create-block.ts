import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlock1759243297803 implements MigrationInterface {
    name = 'CreateBlock1759243297803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "block" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "blockedUserId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_b7c8985f27f5b0d1820832318da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_c9a8df2f7cbbae1cda940694409" FOREIGN KEY ("blockedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_c9a8df2f7cbbae1cda940694409"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_b7c8985f27f5b0d1820832318da"`);
        await queryRunner.query(`DROP TABLE "block"`);
    }

}
