Microservicio de Clientes (NestJS)
Este proyecto implementa el microservicio de gestión de clientes dentro de un sistema de ventas distribuido, utilizando NestJS. Su función principal es manejar todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con la información de los clientes, interactuando directamente con una base de datos PostgreSQL.

Tecnologías Utilizadas:
NestJS: Un framework progresivo de Node.js, ideal para construir aplicaciones del lado del servidor escalables y eficientes, siguiendo principios de arquitectura modular.

Prisma: Un ORM (Object-Relational Mapper) y generador de cliente moderno para Node.js y TypeScript, que proporciona una forma segura y tipada de interactuar con la base de datos.

PostgreSQL: Un potente sistema de gestión de bases de datos relacionales, utilizado para almacenar la información de los clientes de manera robusta y fiable.

TCP (Transmission Control Protocol): El protocolo de comunicación base utilizado para la interacción entre este microservicio y el Gateway principal.

Detalles del Microservicio:
Rol: Provee las funcionalidades CRUD para la entidad Client.

Puerto de Escucha (Servidor TCP): 3004

Método de Comunicación: Protocolo TCP de NestJS (Request-Response basado en patrones de mensaje).

Modelo de Datos (Prisma - Client):
El microservicio gestiona la entidad Client con el siguiente esquema, definido en prisma/schema.prisma:

model Client {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Funcionalidades Expuestas (Patrones de Mensaje TCP):
Este microservicio expone sus funcionalidades a través de los siguientes patrones de mensaje TCP. El Gateway debe enviar mensajes con el cmd especificado y el payload (argumentos) correspondiente.

cmd

Descripción

Payload Esperado (data)

Retorno (Promise<...>)

createClient

Crea un nuevo cliente en la base de datos.

Omit<Client, 'id' | 'createdAt' | 'updatedAt'>(ej.{ firstName: 'Juan', email: 'j@ex.com' })

Client

findAllClients

Obtiene una lista de todos los clientes.

{} (Objeto vacío o cualquier valor, no se utiliza)

Client[]

findClientById

Busca y devuelve un cliente específico por su ID.

number (el ID del cliente)

Client | null

updateClient

Actualiza los datos de un cliente existente.

{ id: number, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>> }

Client

deleteClient

Elimina un cliente de la base de datos por su ID.

number (el ID del cliente a eliminar)

Client

Cómo Poner en Marcha el Microservicio:
Sigue estos pasos para configurar y ejecutar el microservicio de clientes en tu entorno de desarrollo.

Prerrequisitos:
Asegúrate de tener instalados los siguientes componentes:

Node.js (versión 16.x o superior recomendada) y npm

PostgreSQL (Servidor de base de datos)

PgAdmin (Herramienta gráfica opcional para administrar PostgreSQL)

NestJS CLI (instalado globalmente: npm i -g @nestjs/cli)

Configuración del Entorno:
Navegar al Directorio del Proyecto:

cd microservice-clientes

(Si necesitas clonarlo: git clone [URL_DE_TU_REPOSITORIO_GITHUB])

Instalar Dependencias del Proyecto:

npm install
npm install @nestjs/microservices prisma @prisma/client

Configurar la Base de Datos PostgreSQL:

Asegúrate de que tu servidor PostgreSQL esté ejecutándose.

Verifica la conexión a tu servidor PostgreSQL (host: localhost, puerto: 5432, usuario: postgres, contraseña: bipc).

Confirma que tienes una base de datos creada para este microservicio, por ejemplo: clientes_db.

Configurar Prisma y la Conexión a la DB:

Abre el archivo .env en la raíz de tu proyecto.

Asegúrate de que la DATABASE_URL esté correctamente configurada con tus credenciales y el nombre de tu base de datos:

# .env
DATABASE_URL="postgresql://postgres:bipc@localhost:5432/clientes_db?schema=public"

Asegúrate de que el esquema de tu modelo Client en prisma/schema.prisma sea el correcto (como se mostró arriba en "Modelo de Datos").

Genera el cliente de Prisma y sincroniza el esquema con tu base de datos (esto creará o actualizará la tabla Client):

npx prisma generate
npx prisma db push

Verificar y Ajustar src/main.ts:

Confirma que src/main.ts está configurado para iniciar el microservicio TCP en el puerto 3004 y escuchar en todas las interfaces:

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Escucha en todas las interfaces de red
      port: 3004,
    },
  });
  await app.listen();
  console.log('Microservicio de clientes escuchando en el puerto 3004');
}
bootstrap();

Iniciar el Microservicio:
Una vez configurado todo lo anterior, para levantar el microservicio de clientes:

npm run start:dev

Deberías ver un mensaje en tu consola indicando que el microservicio está escuchando en el puerto 3004.

Cómo Probar el Funcionamiento (Simulando el Gateway):
Dado que este es un microservicio TCP, no se puede probar directamente desde un navegador web o Postman con peticiones HTTP/REST. La forma más efectiva de probarlo es simulando la comunicación que haría el Gateway principal o un cliente de microservicios.

Puedes crear un pequeño proyecto NestJS separado para actuar como un "cliente de prueba" que envíe mensajes a tu microservicio. Sigue estos pasos para crear y usar este cliente de prueba:

Crear un Nuevo Proyecto NestJS para Pruebas (en otro directorio):
Abre una nueva terminal (no la del microservicio de clientes) y crea un nuevo proyecto NestJS, por ejemplo, test-gateway-client:

nest new test-gateway-client
cd test-gateway-client

Instalar Dependencia de Microservicios en el Cliente de Prueba:

npm install @nestjs/microservices

Configurar el Cliente de Prueba en src/main.ts del Proyecto de Prueba:
Reemplaza el contenido del src/main.ts de este nuevo proyecto test-gateway-client con el siguiente código. Este script se encargará de enviar solicitudes a tu microservicio de clientes.

// src/main.ts del proyecto test-gateway-client
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { AppModule } from './app.module'; // Puedes dejarlo vacío o con componentes básicos

async function bootstrap() {
  // Opcional: Si quieres un módulo mínimo para NestFactory
  const app = await NestFactory.create(AppModule); // Se usa create() para una app normal que ejecutará el script

  const clientMicroservice = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: '192.168.20.68', // ¡LA IP DE TU MÁQUINA DONDE CORRE EL MICROSERVICIO DE CLIENTES!
      port: 3004,            // EL PUERTO DE TU MICROSERVICIO DE CLIENTES
    },
  });

  // Asegúrate de que el cliente proxy se conecte
  await clientMicroservice.connect();
  console.log('Cliente de prueba conectado al microservicio de clientes.');

  try {
    console.log('\n--- Probando createClient ---');
    const newClientData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '111222333',
      address: 'Calle Falsa 123'
    };
    const createdClient = await clientMicroservice.send({ cmd: 'createClient' }, newClientData).toPromise();
    console.log('Cliente creado:', createdClient);

    const createdClientId = createdClient.id; // Guarda el ID para probar otras operaciones

    console.log('\n--- Probando findAllClients ---');
    const allClients = await clientMicroservice.send({ cmd: 'findAllClients' }, {}).toPromise();
    console.log('Todos los clientes:', allClients);

    if (createdClientId) {
      console.log(`\n--- Probando findClientById (${createdClientId}) ---`);
      const foundClient = await clientMicroservice.send({ cmd: 'findClientById' }, createdClientId).toPromise();
      console.log('Cliente encontrado por ID:', foundClient);

      console.log(`\n--- Probando updateClient (${createdClientId}) ---`);
      const updatedClientData = { email: 'juan.perez.updated@example.com', phone: '999888777' };
      const updatedClient = await clientMicroservice.send({ cmd: 'updateClient' }, { id: createdClientId, data: updatedClientData }).toPromise();
      console.log('Cliente actualizado:', updatedClient);

      console.log(`\n--- Probando deleteClient (${createdClientId}) ---`);
      const deletedClient = await clientMicroservice.send({ cmd: 'deleteClient' }, createdClientId).toPromise();
      console.log('Cliente eliminado:', deletedClient);

      console.log('\n--- Verificando después de eliminar ---');
      const verifyDeleted = await clientMicroservice.send({ cmd: 'findClientById' }, createdClientId).toPromise();
      console.log('Verificación de cliente eliminado (debería ser null):', verifyDeleted);
    } else {
      console.warn('No se pudo obtener el ID del cliente creado para pruebas adicionales.');
    }

  } catch (error) {
    console.error('Error al probar el microservicio:', error.message);
  } finally {
    await clientMicroservice.close();
    await app.close(); // Cierra la aplicación NestJS de prueba
    console.log('\nCliente de prueba desconectado y aplicación cerrada.');
  }
}
bootstrap();

Ejecutar el Cliente de Prueba:
Asegúrate de que tu microservicio de clientes (microservice-clientes) esté corriendo en su propia terminal (npm run start:dev).
Luego, en la terminal de tu nuevo proyecto test-gateway-client, ejecuta:

npm run start # O npm run start:dev si también está en modo watch

Verás en la consola de test-gateway-client cómo se envían las peticiones y se reciben las respuestas de tu microservicio de clientes, confirmando su correcto funcionamiento.