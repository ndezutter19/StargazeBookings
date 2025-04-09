import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.mts';
import protectedRoutes from './routes/protected.mts'; // 👈 Add this line
import eventRoutes from './routes/event.mts'; // 👈 Add this
import bookingRoutes from './routes/booking.mts';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes); // 👈 Mount the new route here
app.use('/api/events', eventRoutes); // 👈 Mount it
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Stargaze Bookings API is running 🚀');
});

try {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ Server failed to start:', error);
}
