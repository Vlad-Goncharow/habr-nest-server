import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function Start() {
  const PORT = process.env.PORT || 4445;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    },
  });

  app.setViewEngine('ejs');
  app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'templates'));

  const config = new DocumentBuilder()
    .setTitle('Habr server docs')
    .setDescription('I choose learn nest/ this my docs on habr server clone')
    .setVersion('1.0.0')
    .addTag('habr')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true, 
  },
});
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server start on port - ${PORT}`));
}

Start();
