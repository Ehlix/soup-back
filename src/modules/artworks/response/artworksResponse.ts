import { UserProfile } from 'src/modules/user-profile/user-profile.model';
import { Artwork } from '../artwork.model';

export class ArtworksResponse extends Artwork {
  constructor(artwork: Artwork, userProfile: UserProfile) {
    super();
    Object.assign(this, artwork);
    Object.assign(this.user, { id: userProfile.userId });
    Object.assign(this.user.userProfile, userProfile);
  }
}
