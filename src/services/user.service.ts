import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/password';
import { CreateUserInput, UserResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
