import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { UserService } from './user.service';
import { UserResponse } from './types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): UserResponse[] {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): UserResponse {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userService.excludePassword(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.create(createUserDto.login, createUserDto.password);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    return this.userService.update(id, updatePasswordDto.newPassword);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const deleted = this.userService.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
