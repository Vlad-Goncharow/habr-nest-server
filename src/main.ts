import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function Start() {
  const PORT = process.env.PORT || 4445

  const app = await NestFactory.create(AppModule, { cors: {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }});

  const config = new DocumentBuilder()
    .setTitle('Habr server docs')
    .setDescription('I choose learn nest/ this my docs on habr server clone')
    .setVersion('1.0.0')
    .addTag('habr')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server start on port - ${PORT}`));
}

Start();
