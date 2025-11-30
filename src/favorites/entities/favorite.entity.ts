import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class Favorites {
  @ApiProperty({
    description: 'List of favorite artist UUIDs',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
    default: [],
  })
  @IsArray()
  artists: string[] = [];

  @ApiProperty({
    description: 'List of favorite album UUIDs',
    example: [
      '323e4567-e89b-12d3-a456-426614174002',
      '423e4567-e89b-12d3-a456-426614174003',
    ],
    type: [String],
    default: [],
  })
  @IsArray()
  albums: string[] = [];

  @ApiProperty({
    description: 'List of favorite track UUIDs',
    example: [
      '523e4567-e89b-12d3-a456-426614174004',
      '623e4567-e89b-12d3-a456-426614174005',
    ],
    type: [String],
    default: [],
  })
  @IsArray()
  tracks: string[] = [];
}
