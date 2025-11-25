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
  findAll(): Artist[] {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Artist {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.artistsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!this.artistsService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    this.artistsService.remove(id);
  }
}
