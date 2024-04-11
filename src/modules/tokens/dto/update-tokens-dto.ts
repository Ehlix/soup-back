import { IsString } from 'class-validator';

export class UpdateTokensDto {
  @IsString({ message: 'Must be a string' })
  readonly userId: string;
  @IsString({ message: 'Must be a string' })
  readonly refreshToken: string;
}
