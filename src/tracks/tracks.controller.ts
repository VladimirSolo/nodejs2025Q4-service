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
  findAll(): Track[] {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Track {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!this.tracksService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    this.tracksService.remove(id);
  }
}
