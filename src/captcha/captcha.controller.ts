import { Controller, Get, Post, Body, Patch, Query, Res, Req, Session } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Response, Request } from 'express';
import { errorResponse } from 'src/utils/error_handling';
import { randomUUID } from 'crypto';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  async getCaptcha(@Session() session: Record<string, any>, @Res() res: Response, @Req() req: Request) {
    try {
      if (!session.captchaId) {
        const captchId = randomUUID();  // Atur ID captcha unik untuk setiap perangkat
        session.captchaId = captchId;
      }
      
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
  async validateCaptcha(@Session() session: Record<string, any>, @Req() req: Request, @Res() res: Response, @Body() body: { code: string }) {
    try {
      const { code } = body;
      const captcha = await this.captchaService.validateCaptcha(session.captchaId, code);
      return res.status(200).json(captcha);
    } catch (error) {
      errorResponse(error, res);
    }
  }

  @Patch()
  async resetCaptcha(@Query('id') id: string) {
    await this.captchaService.resetCaptcha(id);
    return { success: true };
  }
}
