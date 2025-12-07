import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './types';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAll(): Promise<Album[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Album> {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.albumsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.albumsService.remove(id);
  }
}
