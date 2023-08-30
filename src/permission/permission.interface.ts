import { AbilityBuilder, Subject, MongoAbility } from '@casl/ability';
import { Role } from '@prisma/client';
import { AuthenticatedUserDTO } from 'src/auth';

export enum AppActions {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export type Roles = Role | 'everyone';

export type AppAbility = MongoAbility<[AppActions, Subject]>;

export type DefinePermissionsForUserRole = (
  user: AuthenticatedUserDTO,
  builder: AbilityBuilder<AppAbility>,
) => void;

export type PermissionsByRoles = Partial<
  Record<Roles, DefinePermissionsForUserRole>
>;

export interface OptionsForFeature {
  permissions: PermissionsByRoles;
}
