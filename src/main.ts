// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Escuchará en todas las interfaces de red de tu máquina, incluyendo 192.168.20.139
      port: 3004,     // El puerto asignado para tu microservicio de clientes
    },
  });
  await app.listen();
  console.log('Microservicio de clientes escuchando en el puerto 3004');
}
bootstrap();