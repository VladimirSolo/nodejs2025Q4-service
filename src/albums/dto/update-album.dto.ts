import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  year: number;

  @IsOptional()
  @ValidateIf((o) => o.artistId !== null)
  @IsUUID()
  artistId: string | null;
}
