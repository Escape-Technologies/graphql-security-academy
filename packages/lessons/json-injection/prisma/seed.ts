import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const generateApiKey = () =>
  Buffer.from(crypto.getRandomValues(new Uint8Array(8))).toString('hex');

await prisma.user.create({
  data: {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    apiKey: generateApiKey(),
  },
});

await prisma.user.create({
  data: {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.net',
    apiKey: generateApiKey(),
  },
});

await prisma.user.create({
  data: {
    firstName: 'Charlie',
    lastName: 'Williams',
    email: 'c.williams@example.com',
    apiKey: generateApiKey(),
  },
});
