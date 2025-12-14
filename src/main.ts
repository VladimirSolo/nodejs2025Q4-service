import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const docsDir = path.join(process.cwd(), 'doc');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const yamlDoc = yaml.dump(document, { lineWidth: -1 });
  fs.writeFileSync(path.join(docsDir, 'api.yaml'), yamlDoc, 'utf8');

  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // app.enableCors();
  //  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/doc`);
  console.log(`YAML file saved to: ${path.join(docsDir, 'api.yaml')}`);
}

bootstrap();
