import express, { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/authMiddleware.mts';

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/bookings - Book an event (Already implemented)
const createBooking: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  const { eventId } = req.body;

  if (!eventId) {
    res.status(400).json({ error: 'Event ID is required' });
    return;
  }

  const event = await prisma.event.findUnique({
    where: { id: Number(eventId) },
    include: { bookings: true },
  });

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      eventId: event.id,
      userId,
    },
  });

  if (existingBooking) {
    res.status(409).json({ error: 'You have already booked this event' });
    return;
  }

  if (event.bookings.length >= event.capacity) {
    res.status(400).json({ error: 'Event is fully booked' });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      user: { connect: { id: userId } },
      event: { connect: { id: event.id } },
    },
  });

  res.status(201).json({ message: 'Booking confirmed!', booking });
};

router.post('/', protect, createBooking);



// DELETE /api/bookings/:id - Cancel a booking
const cancelBooking: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  const bookingId = Number(req.params.id);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  // Only allow the owner or an admin to delete
  if (!isAdmin && booking.userId !== userId) {
    res.status(403).json({ error: 'Unauthorized to cancel this booking' });
    return;
  }

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  res.json({ message: 'Booking canceled successfully' });
};

router.delete('/:id', protect, cancelBooking);

// GET /api/bookings/mine - Get all bookings for the logged-in user
const getMyBookings: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
  
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        event: true, // include event info in the response
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    res.json({ bookings });
  };
  
  router.get('/mine', protect, getMyBookings);


export default router;
