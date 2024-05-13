import { IsString, Length, IsOptional, IsJSON, IsArray } from 'class-validator';

export class CreateUserProfileDto {
  @IsString({ message: 'Must be a string' })
  @Length(4, 50, { message: 'Must be more than 4 and less than 50' })
  readonly city: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 100, { message: 'Must be more than 4 and less than 100' })
  readonly country: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 200, { message: 'Must be more than 4 and less than 200' })
  readonly headline: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 50, { message: 'Must be more than 4 and less than 50' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  @IsOptional()
  @Length(0, 1000, { message: 'Must be more than 0 and less than 1000' })
  readonly description: string | undefined;

  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly avatar: string | undefined;

  @IsArray({ message: 'Must be an array' })
  @IsOptional()
  readonly folders: string[];

  @IsJSON()
  @IsOptional()
  readonly social: JSON | undefined;
}
