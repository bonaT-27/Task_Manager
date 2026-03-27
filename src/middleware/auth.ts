import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log
    
    if (!authHeader) {
      console.log('No authorization header'); // Debug log
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Debug log
    
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded); // Debug log
    
    req.userId = decoded.userId;
    console.log('Set userId:', req.userId); // Debug log
    
    next();
  } catch (error) {
    console.error('Auth error:', error); // Debug log
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};