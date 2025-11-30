import { IsArray, IsNotEmpty } from 'class-validator';

export class Favorites {
  @IsArray()
  @IsNotEmpty()
  artists: string[] = [];

  @IsArray()
  @IsNotEmpty()
  albums: string[] = [];

  @IsArray()
  @IsNotEmpty()
  tracks: string[] = [];
}
