import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Favorites } from './entities/favorite.entity';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all favorites',
    type: Favorites,
  })
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Track successfully added to favorites',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Track added to favorites',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Track does not exist',
  })
  async addTrack(@Param('id') id: string) {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove track from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Track successfully removed from favorites',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found in favorites',
  })
  async removeTrack(@Param('id') id: string): Promise<void> {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Album UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Album successfully added to favorites',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Album added to favorites',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Album does not exist',
  })
  async addAlbum(@Param('id') id: string) {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove album from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Album UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Album successfully removed from favorites',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Album not found in favorites',
  })
  async removeAlbum(@Param('id') id: string): Promise<void> {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Artist successfully added to favorites',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Artist added to favorites',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Artist does not exist',
  })
  async addArtist(@Param('id') id: string) {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return await this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Artist successfully removed from favorites',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist not found in favorites',
  })
  async removeArtist(@Param('id') id: string): Promise<void> {
    if (!this.favoritesService.validateUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    await this.favoritesService.removeArtist(id);
  }
}
