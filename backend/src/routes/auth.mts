import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // Load env vars
const JWT_SECRET = process.env.JWT_SECRET!;

const prisma = new PrismaClient();
const router = express.Router();

interface RegisterBody {
  email: string;
  password: string;
  role?: string;
}

// POST /register
router.post(
  '/register',
  (async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
      const { email, password, role } = req.body;

      // 1. Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Create the user in the database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'user'
        }
      });

      res.status(201).json({ message: 'User created', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }) as express.RequestHandler
);

// POST /login
router.post(
  '/login',
  (async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 2. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send token back
    res.status(200).json({ token });
  }) as express.RequestHandler
);

export default router;
