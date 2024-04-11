import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Must be a string' })
  email: string;

  @IsString({ message: 'Must be a string' })
  password: string;
}
