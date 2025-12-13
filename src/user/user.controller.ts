import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse } from './types';
import { validate as isUuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.userService.create(createUserDto.login, hashedPassword);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.userService.excludePassword(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );
    return await this.userService.update(id, hashedNewPassword);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const deleted = await this.userService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
