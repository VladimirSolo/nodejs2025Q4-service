import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { HttpLoggerMiddleware } from './logging/http-logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggingModule } from './logging/logging.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './logging/all-exceptions.filter';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // }),
    PrismaModule,
    UserModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
    AuthModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
