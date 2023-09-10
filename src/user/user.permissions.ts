import { Permissions } from 'src/permissions';
import { UserDTO, UserIdDTO } from './dto';
import { UpdateUserDTO } from './dto/update-user.dto';

export enum UserActions {
  read = 'read',
  update = 'update',
}

export const UserPermissions: Permissions = {
  user(user, { can }) {
    can(UserActions.read, UserIdDTO, { id: user.id });
    can(UserActions.update, UserDTO, ['id', 'email'], { id: user.id });
  },

  admin(user, { can }) {
    can(UserActions.read, UserDTO);
    can(UserActions.update, UpdateUserDTO, ['id', 'email', 'activated'], {
      roles: { $nin: ['admin', 'superadmin'] },
    });
    can(UserActions.update, UpdateUserDTO, ['id', 'email'], {
      id: user.id,
    });
  },
};
