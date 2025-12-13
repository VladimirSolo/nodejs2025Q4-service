import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserResponse } from './types';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(login: string, password: string): Promise<UserResponse> {
    const timestamp = Math.floor(Date.now() / 1000);

    try {
      const user = await this.prisma.user.create({
        data: {
          login,
          password,
          version: 1,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
      return this.excludePassword(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this login already exists');
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async update(id: string, newPassword: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
        updatedAt: Math.floor(Date.now() / 1000),
      },
    });

    return this.excludePassword(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  excludePassword(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}
