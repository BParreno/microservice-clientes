// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la siembra de datos...');

  // Eliminar datos existentes para evitar duplicados en cada siembra (opcional, pero útil para desarrollo)
  await prisma.client.deleteMany({});
  console.log('Datos de clientes existentes eliminados.');

  // Crear clientes de ejemplo
  const client1 = await prisma.client.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown',
    },
  });
  console.log(`Cliente creado: ${client1.firstName} ${client1.lastName}`);

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '098-765-4321',
      address: '456 Oak Ave, Otherville',
    },
  });
  console.log(`Cliente creado: ${client2.firstName} ${client2.lastName}`);

  const client3 = await prisma.client.create({
    data: {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      // phone y address son opcionales, así que no los incluimos aquí para demostrarlo
    },
  });
  console.log(`Cliente creado: ${client3.firstName} ${client3.lastName}`);

  console.log('Siembra de datos completada.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });