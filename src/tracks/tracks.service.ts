import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './types';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany() as Promise<Track[]>;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track as Track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.prisma.track.create({
      data: createTrackDto,
    });

    return newTrack as Track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    await this.findOne(id);

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    return updatedTrack as Track;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.track.delete({
      where: { id },
    });

    await this.favoritesService.removeTrackFromFavorites(id);
  }

  async updateArtistIdToNull(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async updateAlbumIdToNull(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
