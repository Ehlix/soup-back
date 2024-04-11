import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;
  // @IsString({ message: 'Must be a string' })
  // @Length(4, 16, { message: 'Must be more than 4 and less than 16' })
  // readonly password: string;
}
