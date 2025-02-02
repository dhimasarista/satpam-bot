import "reflect-metadata";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Captcha } from "./captcha/entities/captcha.entity";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: configService.get<string>("DB_HOST"),
  port: configService.get<number>("DB_PORT"),
  username: configService.get<string>("DB_USER"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  entities: [Captcha], // Ensure Captcha entity is included
  migrations: ["dist/migrations/*.js"], // Pastikan path ini sesuai
  synchronize: true, // Hindari `true` di production
});