import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './types';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) { }

  @Get()
  async findAll(): Promise<Artist[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Artist> {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.artistsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.artistsService.remove(id);
  }
}
