import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Pastikan ini digunakan jika Anda menggunakan TypeORM
import { CaptchaService } from './captcha.service';
import { Captcha } from './entities/captcha.entity';
import { CaptchaController } from './captcha.controller';
import { AppDataSource } from 'src/data-source';

@Module({
  imports: [TypeOrmModule.forFeature([Captcha])], // Import entitas di sini jika menggunakan TypeORM,
  controllers: [CaptchaController],
  providers: [
    CaptchaService,
    {
      provide: 'DataSource',
      useValue: AppDataSource,
    },
  ], // Daftarkan CaptchaRepository di provider
})
export class CaptchaModule {}
