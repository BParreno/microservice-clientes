// src/clients/clients.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from '@prisma/client'; // Importa el tipo 'Client' generado por Prisma de tu schema

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {} // Inyecta el PrismaService

  // Método para crear un nuevo cliente
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // Omit<Client, ...> asegura que no se intenten pasar id, createdAt, updatedAt al crear
    return this.prisma.client.create({ data });
  }

  // Método para obtener todos los clientes
  async findAllClients(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  // Método para obtener un cliente por su ID
  async findClientById(id: number): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { id } });
  }

  // Método para actualizar un cliente. Partial<Omit<Client,...>> permite actualizar solo algunos campos
  async updateClient(id: number, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  // Método para eliminar un cliente
  async deleteClient(id: number): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }
}