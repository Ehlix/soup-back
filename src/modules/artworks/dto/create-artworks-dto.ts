import { IsArray, IsString, Length } from 'class-validator';

export class CreateArtworksDto {
  @IsString({ message: 'Must be a string' })
  @Length(4, 26, { message: 'Must be more than 4 and less than 26' })
  readonly title: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 36, { message: 'Must be more than 4 and less than 36' })
  readonly description: string;

  @IsString({ message: 'Must be a string' })
  readonly thumbnail: string;

  @IsArray({ message: 'Must be an array' })
  readonly files: string[];

  @IsArray({ message: 'Must be an array' })
  readonly folders: string[];

  @IsArray({ message: 'Must be an array' })
  readonly medium: string[];

  @IsArray({ message: 'Must be an array' })
  readonly subjects: string[];
}
