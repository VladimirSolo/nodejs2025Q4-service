import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;
}
