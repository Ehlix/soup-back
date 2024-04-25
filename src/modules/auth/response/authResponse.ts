import { UserProfile } from 'src/modules/user-profile/user-profile.model';

export class AuthResponse {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  userProfile: UserProfile | null;
  accessToken: string;
}
