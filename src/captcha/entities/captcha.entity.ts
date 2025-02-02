import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity('captchas') // Nama tabel sesuai dengan yang ada di database
export class Captcha extends BaseEntity {
  @PrimaryColumn('varchar', { length: 36 }) // id adalah varchar(36) dan menjadi primary key
  id: string;

  @Column('varchar', { length: 255 }) // image sesuai dengan tipe varchar(255)
  image: string;

  @Column('varchar', { length: 255 }) // code sesuai dengan tipe varchar(255)
  code: string;

  @Column('tinyint', { default: 0, name: "is_validated" }) // is_validated sesuai dengan tipe tinyint(1), default 0
  isValidated: boolean;

  @CreateDateColumn({name: "created_at"}) // Untuk created_at dengan timestamp
  createdAt: Date;

  @UpdateDateColumn({name: "updated_at"}) // Untuk updated_at dengan timestamp, auto update on change
  updatedAt: Date;
}
