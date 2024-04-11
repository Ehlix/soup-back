import { IsString } from 'class-validator';

export class CreateTokensDto {
  @IsString({ message: 'Must be a string' })
  readonly userId: string;
}
