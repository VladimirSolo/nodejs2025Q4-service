import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './types';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumsService {
  private albums: Map<string, Album> = new Map();

  constructor(
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  create(createAlbumDto: CreateAlbumDto) {
    const id = uuidv4();
    const newAlbum: Album = {
      id,
      ...createAlbumDto,
    };
    this.albums.set(id, newAlbum);
    return newAlbum;
  }

  findAll() {
    return Array.from(this.albums.values());
  }

  findOne(id: string) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);
    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };
    this.albums.set(id, updatedAlbum);
    return updatedAlbum;
  }

  remove(id: string) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    this.albums.delete(id);

    this.tracksService.updateAlbumIdToNull(id);

    this.favoritesService.removeAlbumFromFavorites(id);
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
