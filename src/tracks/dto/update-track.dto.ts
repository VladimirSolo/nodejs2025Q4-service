import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;

  @IsOptional()
  @IsUUID()
  albumId?: string | null;

  @IsInt()
  @IsOptional()
  duration?: number;
}
