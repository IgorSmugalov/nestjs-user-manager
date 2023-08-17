import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { UserIdDTO } from './dto';
import { Role } from '@prisma/client';

export type Subjects = InferSubjects<typeof UserIdDTO>;

export const permissions: Permissions<Role, Subjects, Actions> = {
  user({ user, can }) {
    can(Actions.read, UserIdDTO, { id: user.id });
  },

  admin({ can }) {
    can(Actions.read, UserIdDTO);
  },
};
