// src/clients/clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../prisma/prisma.module'; // Importa el PrismaModule

@Module({
  imports: [PrismaModule], // Hacemos que PrismaService esté disponible para ClientsService
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService] // Exportamos el servicio por si el Appmodule u otros módulos lo necesitaran
})
export class ClientsModule {}