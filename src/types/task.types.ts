// Import Prisma's generated types
import { TaskStatus as PrismaTaskStatus, TaskPriority as PrismaTaskPriority } from '@prisma/client';

// Re-export Prisma enums
export { PrismaTaskStatus as TaskStatus, PrismaTaskPriority as TaskPriority };

// Task interface using Prisma's types
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: PrismaTaskStatus;
  priority: PrismaTaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: PrismaTaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: PrismaTaskStatus;
  priority?: PrismaTaskPriority;
  dueDate?: Date;
}