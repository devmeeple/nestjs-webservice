import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 원하는 값만 정의
    forbidNonWhitelisted: true,
    transform: true, // 값을 넣은 적이 없다면 기본값을 넣을 수 있도록 함
    transformOptions: {
      enableImplicitConversion: true, // class-validator 를 기반으로 임의변환 허가
    },
  }));
  await app.listen(3000);
}
bootstrap();
