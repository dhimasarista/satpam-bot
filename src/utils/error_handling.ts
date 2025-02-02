import { BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

export function errorResponse(error: any, response: Response) {
  if (error instanceof BadRequestException) {
    return response.status(400).json({
      message: error.message
    });
  }
  Logger.error(error);
  return response.status(500).json({
    message: "internal server error",
  });
}