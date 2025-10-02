import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordToken1759336900603 implements MigrationInterface {
    name = 'CreatePasswordToken1759336900603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passwords_token" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "expireDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_904993c30f31ac0fa3265b69ee" UNIQUE ("userId"), CONSTRAINT "PK_b3ade3c1da4b2b63e2a70050429" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "passwords_token" ADD CONSTRAINT "FK_904993c30f31ac0fa3265b69ee2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passwords_token" DROP CONSTRAINT "FK_904993c30f31ac0fa3265b69ee2"`);
        await queryRunner.query(`DROP TABLE "passwords_token"`);
    }

}
