import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './types';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  private tracks: Map<string, Track> = new Map();

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) { }

  findAll(): Track[] {
    return Array.from(this.tracks.values());
  }

  findOne(id: string): Track {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const id = uuidv4();
    const newTrack: Track = {
      id,
      ...createTrackDto,
    };
    this.tracks.set(id, newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.findOne(id);
    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  remove(id: string): void {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    this.tracks.delete(id);

    this.favoritesService.removeTrackFromFavorites(id);
  }

  updateArtistIdToNull(artistId: string): void {
    this.tracks.forEach((track, id) => {
      if (track.artistId === artistId) {
        const updatedTrack = { ...track, artistId: null };
        this.tracks.set(id, updatedTrack);
      }
    });
  }

  updateAlbumIdToNull(albumId: string): void {
    this.tracks.forEach((track, id) => {
      if (track.albumId === albumId) {
        const updatedTrack = { ...track, albumId: null };
        this.tracks.set(id, updatedTrack);
      }
    });
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
