import express, { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/authMiddleware.mts';
import { checkRole } from '../middleware/checkRole.mts';

const prisma = new PrismaClient();
const router = express.Router();


// GET /events - Public
const listEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};
router.get('/', listEvents);


// GET /events/:id - Public
const getEvent: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  res.json(event);
};
router.get('/:id', getEvent);


// POST /events - Admin only
const createEvent: RequestHandler = async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    if (!title || !description || !date || !location || !capacity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: Number(capacity),
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};
router.post('/', protect, checkRole('admin'), createEvent);


// PUT /events/:id - Admin only
const updateEvent: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, date, location, capacity } = req.body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: Number(capacity),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};
router.put('/:id', protect, checkRole('admin'), updateEvent);


// DELETE /events/:id - Admin only
const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
router.delete('/:id', protect, checkRole('admin'), deleteEvent);


export default router;
