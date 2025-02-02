import { BadRequestException, Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { randomUUID } from 'crypto';
import { Captcha } from './entities/captcha.entity'; // Pastikan entitas diimport di sini

@Injectable()
export class CaptchaService {
  private captchaData: { image_path: string, solution: string }[] = [];

  constructor(private dataSource: DataSource) {
    this.loadCaptcha();
  }

  private loadCaptcha() {
    const csv = path.join(__dirname, '..', '..', 'data', 'captcha_data.csv');

    fs.createReadStream(csv)
      .pipe(csvParser())
      .on('data', (data) => {
        this.captchaData.push(data);
      })
      .on('end', () => true)
      .on('error', (error) => {
        throw new Error(error.message);
      });
  }

  private getCaptchaRepository() {
    return this.dataSource.getRepository(Captcha); // Mengambil repository secara dinamis
  }

  async validateCaptcha(captchaId: string, userInput: string) {
    const captchaRepository = this.getCaptchaRepository();
    const session = await captchaRepository.findOne({ where: { id: captchaId } });

    if (!session || !session.isValidated) {
      throw new BadRequestException('Session not found');
    }

    if (session.code === userInput) {
      session.isValidated = true;
      await captchaRepository.save(session);
      return true;
    }
    return false;
  }

  async resetCaptcha(id: string): Promise<void> {
    const captchaRepository = this.getCaptchaRepository();
    
    try {
      // Ambil captcha yang ada berdasarkan ID
      const captcha = await captchaRepository.findOne({ where: { id } });
  
      // Jika captcha tidak ditemukan, lempar error
      if (!captcha) {
        throw new BadRequestException(`Captcha with ID ${id} not found`);
      }
  
      // Generate captcha baru
      const randomCaptcha = this.randomCaptcha();
      const imagePath = path.join(__dirname, '..', '..', 'data', randomCaptcha.image_path);
  
      // Cek apakah file image ada
      if (!fs.existsSync(imagePath)) {
        throw new BadRequestException(`Captcha image file not found at ${imagePath}`);
      }
  
      // Update captcha dengan data baru
      await captchaRepository.update(id, {
        image: randomCaptcha.image_path,
        code: randomCaptcha.solution,
        isValidated: false,
      });
  
    } catch (error) {
      throw new BadRequestException(`Failed to reset captcha: ${error.message}`);
    }
  }  

  private randomCaptcha() {
    return this.captchaData[Math.floor(Math.random() * 6001)];
  }

  private async createCaptcha(id: string) {
    const captchaRepository = this.getCaptchaRepository();
    const randomCaptcha = this.randomCaptcha();
    const imagePath = path.join(__dirname, '..', '..', 'data', randomCaptcha.image_path);

    if (!fs.existsSync(imagePath)) {
      throw new BadRequestException('File not found');
    }

    const newCaptcha = captchaRepository.create({
      id: id, // Gunakan ID yang diberikan
      image: randomCaptcha.image_path,
      code: randomCaptcha.solution,
      isValidated: false,
    });

    await captchaRepository.save(newCaptcha);
    const fileBuffer = fs.readFileSync(imagePath);
    const mimeType = mime.lookup(imagePath) || 'application/octet-stream';

    return { captcha: newCaptcha, fileBuffer, mimeType };
  }

async getCaptcha(captchaId: string) {
    const captchaRepository = this.getCaptchaRepository();

    let captcha = await captchaRepository.findOne({
      where: { id: captchaId },
    });

    if (!captcha) {
      return this.createCaptcha(captchaId);
    }

    if (captcha.isValidated) {
      throw new BadRequestException('Captcha already validated');
    }

    const imagePath = path.join(__dirname, '..', '..', 'data', captcha.image);
    const fileBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;
    if (!fileBuffer) {
      throw new BadRequestException('Captcha image not found');
    }

    const mimeType = mime.lookup(imagePath) || 'application/octet-stream';

    return { captcha, fileBuffer, mimeType };
  }


  private getFileBuffer(filePath: string): Buffer {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }
    return fs.readFileSync(filePath);
  }
}
