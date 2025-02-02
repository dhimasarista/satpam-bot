// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Captcha } from 'src/captcha/entities/captcha.entity';

dotenv.config(); // Memastikan file .env dimuat

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Captcha],
  migrations: ['dist/migrations/*.js'],
  synchronize: true, // Jangan gunakan `true` di production
  autoLoadEntities: true,
};
