import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Setup session middleware
  app.use(
    session({
      secret: '12345', // Gantilah dengan string yang lebih aman
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true,secure: false }, // Pastikan untuk mengonfigurasi ini untuk environment production
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
