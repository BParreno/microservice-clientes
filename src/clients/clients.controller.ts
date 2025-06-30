// src/clients/clients.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices'; // Importa MessagePattern
import { ClientsService } from './clients.service';
import { Client } from '@prisma/client'; // Importa el tipo 'Client'

@Controller() // En microservicios TCP, no necesitas especificar un path HTTP aquí
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Cada @MessagePattern define un "comando" que este microservicio puede procesar
  // El gateway enviará un mensaje con { cmd: 'createClient' } y un payload con los datos del cliente
  @MessagePattern({ cmd: 'createClient' })
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    return this.clientsService.createClient(data);
  }

  @MessagePattern({ cmd: 'findAllClients' })
  async findAllClients(): Promise<Client[]> {
    return this.clientsService.findAllClients();
  }

  @MessagePattern({ cmd: 'findClientById' })
  async findClientById(id: number): Promise<Client | null> {
    // El 'id' se recibe directamente como el payload del mensaje
    return this.clientsService.findClientById(id);
  }

  @MessagePattern({ cmd: 'updateClient' })
  async updateClient({ id, data }: { id: number; data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>> }): Promise<Client> {
    // Para actualizar, se espera un objeto con { id: ID_DEL_CLIENTE, data: { ...NUEVOS_DATOS } }
    return this.clientsService.updateClient(id, data);
  }

  @MessagePattern({ cmd: 'deleteClient' })
  async deleteClient(id: number): Promise<Client> {
    return this.clientsService.deleteClient(id);
  }
}