import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCaptchasTable1738374419558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "captchas",
            columns: [
              {
                name: "id",
                type: "varchar",
                length: "36",
                isPrimary: true,
                isUnique: true,
              },
              {
                name: "image",
                type: "varchar",
                length: "255",
                isNullable: false,
              },
              {
                name: "code",
                type: "varchar",
                length: "255",
                isNullable: false,
              },
              {
                name: "is_validated",
                type: "boolean",
                default: false,
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
              },
            ],
          }),
          true
        );
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("captchas");
    }

}
