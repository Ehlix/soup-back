import { IsString, Length, IsOptional, IsJSON } from 'class-validator';

export class CreateUserProfileDto {
  @IsString({ message: 'Must be a string' })
  @Length(4, 26, { message: 'Must be more than 4 and less than 26' })
  readonly city: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 26, { message: 'Must be more than 4 and less than 26' })
  readonly country: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 36, { message: 'Must be more than 4 and less than 36' })
  readonly headline: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 26, { message: 'Must be more than 4 and less than 26' })
  readonly name: string;

  @IsJSON()
  @IsOptional()
  readonly social: JSON | undefined;
}
