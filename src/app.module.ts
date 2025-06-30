// src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module'; // Importa tu ClientsModule

@Module({
  imports: [ClientsModule], // Agrega ClientsModule a los imports
  controllers: [], // Puedes eliminar AppController y AppService si no los vas a usar
  providers: [],   // ya que la lógica de microservicios está en ClientsModule
})
export class AppModule {}