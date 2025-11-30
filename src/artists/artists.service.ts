import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './types';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private artists: Map<string, Artist> = new Map();

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  findAll(): Artist[] {
    return Array.from(this.artists.values());
  }

  findOne(id: string): Artist {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const id = uuidv4();
    const newArtist: Artist = {
      id,
      ...createArtistDto,
    };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    const updatedArtist = {
      ...artist,
      ...updateArtistDto,
    };
    this.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  remove(id: string): void {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    this.artists.delete(id);

    this.favoritesService.removeArtistFromFavorites(id);
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
