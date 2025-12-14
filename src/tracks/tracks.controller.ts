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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './types';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Get()
  async findAll(): Promise<Track[]> {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Track> {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.tracksService.remove(id);
  }
}
