// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'; // Asegúrate de importar OnModuleDestroy
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Esto conectará Prisma a la base de datos cuando el módulo se inicialice
    await this.$connect();
  }

  async onModuleDestroy() {
    // Esto desconectará Prisma de la base de datos cuando el módulo se destruya (ej. al apagar la app)
    await this.$disconnect();
  }

  // Hemos eliminado la función enableShutdownHooks que causaba el error
  // porque OnModuleDestroy es una forma más limpia de manejar la desconexión
  // en un servicio de NestJS puro (especialmente para microservicios).
}