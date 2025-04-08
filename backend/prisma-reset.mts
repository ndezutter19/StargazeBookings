import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function reset() {
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ All data deleted.');
}

reset()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
