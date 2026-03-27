import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskInput, UpdateTaskInput, Task, TaskStatus, TaskPriority } from '../types';
import { AppError } from '../middleware/errorHandler';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(userId: string): Promise<Task[]> {
    console.log('TaskService.getTasks - userId:', userId); // Debug log
    return await this.taskRepository.findAll(userId);
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    console.log('TaskService.getTaskById - id:', id, 'userId:', userId); // Debug log
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    console.log('TaskService.createTask - userId:', userId, 'data:', data); // Debug log
    
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }
    
    const taskData = { ...data, userId };
    console.log('Task data to create:', taskData); // Debug log
    
    return await this.taskRepository.create(taskData);
  }

  async updateTask(id: string, userId: string, data: UpdateTaskInput): Promise<Task> {
    console.log('TaskService.updateTask - id:', id, 'userId:', userId); // Debug log
    await this.getTaskById(id, userId);
    return await this.taskRepository.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string): Promise<Task> {
    console.log('TaskService.deleteTask - id:', id, 'userId:', userId); // Debug log
    await this.getTaskById(id, userId);
    return await this.taskRepository.delete(id, userId);
  }

  async getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    console.log('TaskService.getTasksByStatus - userId:', userId, 'status:', status); // Debug log
    return await this.taskRepository.findByStatus(userId, status);
  }

  async getTasksByPriority(userId: string, priority: TaskPriority): Promise<Task[]> {
    console.log('TaskService.getTasksByPriority - userId:', userId, 'priority:', priority); // Debug log
    return await this.taskRepository.findByPriority(userId, priority);
  }
}

// Export the instance
import { taskRepository } from '../repositories/task.repository';
export const taskService = new TaskService(taskRepository);