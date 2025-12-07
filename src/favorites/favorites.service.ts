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
// import { Favorites } from './entities/favorite.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) { }

  async findAll() {
    const favoriteArtists = await this.prisma.favoriteArtist.findMany({
      include: { artist: true },
    });

    const favoriteAlbums = await this.prisma.favoriteAlbum.findMany({
      include: { album: true },
    });

    const favoriteTracks = await this.prisma.favoriteTrack.findMany({
      include: { track: true },
    });

    return {
      artists: favoriteArtists.map((fa) => fa.artist),
      albums: favoriteAlbums.map((fa) => fa.album),
      tracks: favoriteTracks.map((ft) => ft.track),
    };
  }

  async addTrack(id: string): Promise<{ message: string }> {
    try {
      await this.tracksService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
    }

    await this.prisma.favoriteTrack.upsert({
      where: { trackId: id },
      update: {},
      create: { trackId: id },
    });

    return { message: 'Track added to favorites' };
  }

  async removeTrack(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteTrack.findUnique({
      where: { trackId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.prisma.favoriteTrack.delete({
      where: { trackId: id },
    });
  }

  async addAlbum(id: string): Promise<{ message: string }> {
    try {
      await this.albumsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Album with id ${id} not found`);
    }

    await this.prisma.favoriteAlbum.upsert({
      where: { albumId: id },
      update: {},
      create: { albumId: id },
    });

    return { message: 'Album added to favorites' };
  }

  async removeAlbum(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteAlbum.findUnique({
      where: { albumId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.prisma.favoriteAlbum.delete({
      where: { albumId: id },
    });
  }

  async addArtist(id: string): Promise<{ message: string }> {
    try {
      await this.artistsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Artist with id ${id} not found`);
    }

    await this.prisma.favoriteArtist.upsert({
      where: { artistId: id },
      update: {},
      create: { artistId: id },
    });

    return { message: 'Artist added to favorites' };
  }

  async removeArtist(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteArtist.findUnique({
      where: { artistId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.prisma.favoriteArtist.delete({
      where: { artistId: id },
    });
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    await this.prisma.favoriteArtist.deleteMany({
      where: { artistId: id },
    });
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    await this.prisma.favoriteAlbum.deleteMany({
      where: { albumId: id },
    });
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    await this.prisma.favoriteTrack.deleteMany({
      where: { trackId: id },
    });
  }

  validateUuid(id: string): boolean {
    return isUuid(id);
  }
}
