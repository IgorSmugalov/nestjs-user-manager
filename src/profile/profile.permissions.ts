import { Permissions } from 'src/permissions';
import { ProfileDTO } from './dto/profile.dto';
import { ProfileIdDTO } from './dto/params.dto';

export enum ProfileActions {
  read = 'read',
  update = 'update',
}

export const profilePermissions: Permissions = {
  everyone(user, { can }) {
    can(ProfileActions.read, ProfileDTO);
  },

  user(user, { can }) {
    can(ProfileActions.update, ProfileIdDTO, {
      id: user.userProfile.id,
    });
  },

  admin(user, { can }) {
    can(ProfileActions.update, ProfileIdDTO);
  },
};
