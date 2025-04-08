import express from 'express';
import { protect } from '../middleware/authMiddleware.mts';
import { checkRole } from '../middleware/checkRole.mts';

const router = express.Router();

router.get('/protected', protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user?.email}!` });
});

// Only authenticated users with role = 'admin' can access this
router.get('/admin-only', protect, checkRole('admin'), (req, res) => {
    res.json({ message: `Welcome admin ${req.user?.email}` });
  });

export default router;
