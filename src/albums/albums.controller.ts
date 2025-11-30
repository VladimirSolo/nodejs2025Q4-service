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
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll(): Album[] {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Album {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!this.albumsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.albumsService.remove(id);
  }
}
