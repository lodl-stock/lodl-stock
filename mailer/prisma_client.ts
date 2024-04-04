import { PrismaClient } from '@prisma/client';

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

global.prisma = prisma;

export default prisma;