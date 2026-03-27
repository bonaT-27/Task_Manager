import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService(userRepository);

// For routes with no params, no query, but with body
export const register = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
