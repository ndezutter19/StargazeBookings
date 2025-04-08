import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      email: 'noah@email.com',
      password: 'hashed_password_here', // just a placeholder
    },
  });

  // 2. Create an event
  const event = await prisma.event.create({
    data: {
      title: 'Lunar Eclipse Viewing',
      description: 'Watch the eclipse under the stars',
      date: new Date('2025-04-15T20:00:00Z'),
      location: 'Phoenix, AZ',
      capacity: 50,
    },
  });

  // 3. Create a booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      eventId: event.id,
    },
  });

  // 4. Fetch the booking with full user and event
  const fullBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      user: true,
      event: true,
    },
  });

  console.log('Full Booking:', fullBooking);
}

main()
  .then(() => {
    console.log('Test script finished.');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
