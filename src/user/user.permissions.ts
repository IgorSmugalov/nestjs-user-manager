import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { UserIdDTO } from './dto';
import { Role } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-user.dto';

export type Subjects = InferSubjects<typeof UserIdDTO | typeof UpdateUserDTO>;

export const permissions: Permissions<Role, Subjects, Actions> = {
  user({ user, can }) {
    can(Actions.read, UserIdDTO, { id: user.id });
  },

  admin({ can, cannot }) {
    can(Actions.read, UserIdDTO);
    can(Actions.update, ['roles', 'activated', 'email'], UpdateUserDTO);
  },
};
