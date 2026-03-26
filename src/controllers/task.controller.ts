import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth';
import { TaskStatus, TaskPriority } from '../types';

export const taskController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getTasks(req.userId!);
      res.json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.getTaskById(req.params.id, req.userId!);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.createTask(req.userId!, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.updateTask(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await taskService.deleteTask(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  getByStatus: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const status = req.params.status as TaskStatus;
      const tasks = await taskService.getTasksByStatus(req.userId!, status);
      res.json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  },

  getByPriority: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const priority = req.params.priority as TaskPriority;
      const tasks = await taskService.getTasksByPriority(req.userId!, priority);
      res.json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  },
};