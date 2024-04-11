import { User } from 'src/modules/users/user.model';

export class AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
