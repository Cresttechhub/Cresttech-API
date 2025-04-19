import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: [
      'https://www.cresttech.org',
      'https://cresttechhub.vercel.app',
      // Optional: Include a regex to match all subdomains of cresttech.org
      /https?:\/\/(.+\.)?cresttech\.org/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // If using cookies/sessions
    exposedHeaders: ['Authorization'], // If using custom headers
  });

  const config = new DocumentBuilder()
    .setTitle('CrestTech Hub')
    .setDescription('CrestTech API Documentation')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    // extraModels: [SuccessResponse, UserResDto],
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log(`Server is running 🚀🚀🚀 on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});
