import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './types';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: createAlbumDto,
    });
    return newAlbum;
  }

  async findAll() {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album as Album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    await this.findOne(id);

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });

    return updatedAlbum as Album;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.album.delete({
      where: { id },
    });

    await this.tracksService.updateAlbumIdToNull(id);
    await this.favoritesService.removeAlbumFromFavorites(id);
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
