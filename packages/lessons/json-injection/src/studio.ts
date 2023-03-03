import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.table(await prisma.user.findMany());
