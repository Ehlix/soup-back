import { IsEmail, IsString } from 'class-validator';

export class GetUserProfileDto {
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;
}
