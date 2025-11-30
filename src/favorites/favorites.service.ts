import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { Favorites } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  private favorites = new Favorites();

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) { }

  findAll() {
    const artists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const albums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const tracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return { artists, albums, tracks };
  }

  addTrack(id: string): { message: string } {
    try {
      this.tracksService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }

    return { message: 'Track added to favorites' };
  }

  removeTrack(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): { message: string } {
    try {
      this.albumsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Album with id ${id} not found`);
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }

    return { message: 'Album added to favorites' };
  }

  removeAlbum(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): { message: string } {
    try {
      this.artistsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Artist with id ${id} not found`);
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }

    return { message: 'Artist added to favorites' };
  }

  removeArtist(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }

  removeArtistFromFavorites(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }

  removeAlbumFromFavorites(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  removeTrackFromFavorites(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
