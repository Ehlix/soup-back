import { UserProfile } from 'src/modules/user-profile/user-profile.model';
import { UserFollow } from '../user-follow.model';

export class UserFollowsResponse extends UserFollow {
  constructor(userFollow: UserFollow, userProfile: UserProfile) {
    super();
    Object.assign(this, userFollow);
    Object.assign(this.follow, { id: userProfile.userId });
    Object.assign(this.follow.userProfile, userProfile);
    Object.assign(this.follower, { id: userProfile.userId });
    Object.assign(this.follower.userProfile, userProfile);
  }
}
