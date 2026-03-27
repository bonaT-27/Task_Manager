import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth';
import { TaskStatus, TaskPriority } from '../types';

export const taskController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('getAll - userId:', req.userId); // Debug log
      const tasks = await taskService.getTasks(req.userId!);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('getAll error:', error); // Debug log
      next(error);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('getById - userId:', req.userId, 'taskId:', req.params.id); // Debug log
      const task = await taskService.getTaskById(req.params.id, req.userId!);
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('getById error:', error); // Debug log
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('create - userId:', req.userId); // Debug log
      console.log('create - body:', req.body); // Debug log
      
      if (!req.userId) {
        console.error('No userId found in request!');
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const task = await taskService.createTask(req.userId, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      console.error('create error:', error); // Debug log
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('update - userId:', req.userId, 'taskId:', req.params.id); // Debug log
      const task = await taskService.updateTask(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('update error:', error); // Debug log
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('delete - userId:', req.userId, 'taskId:', req.params.id); // Debug log
      await taskService.deleteTask(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      console.error('delete error:', error); // Debug log
      next(error);
    }
  },

  getByStatus: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const status = req.params.status as TaskStatus;
      console.log('getByStatus - userId:', req.userId, 'status:', status); // Debug log
      const tasks = await taskService.getTasksByStatus(req.userId!, status);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('getByStatus error:', error); // Debug log
      next(error);
    }
  },

  getByPriority: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const priority = req.params.priority as TaskPriority;
      console.log('getByPriority - userId:', req.userId, 'priority:', priority); // Debug log
      const tasks = await taskService.getTasksByPriority(req.userId!, priority);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('getByPriority error:', error); // Debug log
      next(error);
    }
  },
};