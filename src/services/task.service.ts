import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskInput, UpdateTaskInput, Task, TaskStatus, TaskPriority } from '../types';
import { AppError } from '../middleware/errorHandler';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(userId: string): Promise<Task[]> {
    return await this.taskRepository.findAll(userId);
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    return await this.taskRepository.create({ ...data, userId });
  }

  async updateTask(id: string, userId: string, data: UpdateTaskInput): Promise<Task> {
    await this.getTaskById(id, userId);
    return await this.taskRepository.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string): Promise<Task> {
    await this.getTaskById(id, userId);
    return await this.taskRepository.delete(id, userId);
  }

  async getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return await this.taskRepository.findByStatus(userId, status);
  }

  async getTasksByPriority(userId: string, priority: TaskPriority): Promise<Task[]> {
    return await this.taskRepository.findByPriority(userId, priority);
  }
}

// Export the instance
import { taskRepository } from '../repositories/task.repository';
export const taskService = new TaskService(taskRepository);