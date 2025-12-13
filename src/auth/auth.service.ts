import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto, LoginDto, TokensResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(dto: SignUpDto): Promise<{ id: string; message: string }> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (typeof dto.login !== 'string' || typeof dto.password !== 'string') {
      throw new BadRequestException('Login and password must be strings');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const timestamp = Math.floor(Date.now() / 1000);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashedPassword,
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    return {
      id: user.id,
      message: 'User created successfully',
    };
  }

  async login(dto: LoginDto): Promise<TokensResponse> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (typeof dto.login !== 'string' || typeof dto.password !== 'string') {
      throw new BadRequestException('Login and password must be strings');
    }

    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.login);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokensResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.login);

      return tokens;
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(
    userId: string,
    login: string,
  ): Promise<TokensResponse> {
    const payload = { userId, login };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
      // expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as string,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
      // expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as string,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }
}
