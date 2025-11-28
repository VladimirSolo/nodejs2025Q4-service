import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [UserModule, ArtistsModule, TracksModule, AlbumsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
