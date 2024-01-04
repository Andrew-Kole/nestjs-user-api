import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
  }));
  await app.listen(3000);
}
bootstrap();
