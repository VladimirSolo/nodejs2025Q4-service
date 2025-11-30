import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserResponse } from './types';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  create(login: string, password: string): UserResponse {
    const timestamp = Date.now();
    const user: User = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.set(user.id, user);
    return this.excludePassword(user);
  }

  findAll(): UserResponse[] {
    return Array.from(this.users.values()).map((user) =>
      this.excludePassword(user),
    );
  }

  findOne(id: string): User | undefined {
    return this.users.get(id);
  }

  update(id: string, newPassword: string): UserResponse {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    this.users.set(id, user);
    return this.excludePassword(user);
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }

  excludePassword(user: User): UserResponse {
    const userResponse = { ...user };
    delete userResponse.password;
    return userResponse;
  }
}
