import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

export default router;