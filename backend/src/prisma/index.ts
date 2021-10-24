import { PrismaClient } from "@prisma/client"

//Realizar a conexão com o BD
const prismaClient = new PrismaClient();

export default prismaClient;