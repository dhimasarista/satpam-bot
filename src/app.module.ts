import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptchaModule } from './captcha/captcha.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { databaseConfig } from './config/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CaptchaModule, 
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
