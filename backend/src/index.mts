import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.mts'; // ✅ needs .mts extension

dotenv.config(); // Load .env variables

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

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
