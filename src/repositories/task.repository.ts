import prisma from '../lib/prisma';
import { CreateTaskInput, Task, UpdateTaskInput, TaskStatus, TaskPriority } from '../types';

export class TaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return await prisma.task.findFirst({
      where: { id, userId },
    });
  }

  async create(data: CreateTaskInput & { userId: string }): Promise<Task> {
    return await prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.PENDING,
        priority: data.priority || TaskPriority.MEDIUM,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateTaskInput): Promise<Task> {
    const existingTask = await this.findById(id, userId);
    if (!existingTask) {
      throw new Error('Task not found or access denied');
    }

    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Task> {
    const existingTask = await this.findById(id, userId);
    if (!existingTask) {
      throw new Error('Task not found or access denied');
    }

    return await prisma.task.delete({
      where: { id },
    });
  }

  async findByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return await prisma.task.findMany({
      where: {
        userId,
        status,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPriority(userId: string, priority: TaskPriority): Promise<Task[]> {
    return await prisma.task.findMany({
      where: {
        userId,
        priority,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const taskRepository = new TaskRepository();
