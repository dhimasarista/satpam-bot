import { Controller, Get, Post, Body, Patch, Query, Res, Req, Session } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Response } from 'express';
import { errorResponse } from 'src/utils/error_handling';
import { randomUUID } from 'crypto';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  async getCaptcha(@Session() session: Record<string, any>, @Res() res: Response, @Req() req: Request) {
    try {
      if (!session.captchaId) {
        session.captchaId = randomUUID();  // Atur ID captcha unik untuk setiap perangkat
      }
      console.log(session);
      
      // Mendapatkan captcha berdasarkan CaptchaId
      const { fileBuffer, mimeType } = await this.captchaService.getCaptcha(session.captchaId);
      
      // Set MIME type dan kirimkan gambar
      res.setHeader('Content-Type', mimeType);
      return res.send(fileBuffer);
    } catch (error) {
      errorResponse(error, res);
    }
  }

  @Post()
  async validateCaptcha(@Session() session: Record<string, any>, @Body() body: { code: string }) {
    const { code } = body;
    const isValid = await this.captchaService.validateCaptcha(session.captchaId, code);
    return { success: isValid };
  }

  @Patch()
  async resetCaptcha(@Query('id') id: string) {
    await this.captchaService.resetCaptcha(id);
    return { success: true };
  }
}
