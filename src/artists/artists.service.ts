import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './types';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany() as Promise<Artist[]>;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist as Artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });

    return newArtist as Artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    await this.findOne(id);

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return updatedArtist as Artist;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.artist.delete({
      where: { id },
    });

    await this.favoritesService.removeArtistFromFavorites(id);
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
