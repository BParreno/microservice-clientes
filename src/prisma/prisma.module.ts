// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Provee el PrismaService
  exports: [PrismaService],   // Exporta el PrismaService para que pueda ser usado en otros módulos
})
export class PrismaModule {}