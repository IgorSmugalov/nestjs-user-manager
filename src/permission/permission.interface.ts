import { AbilityBuilder, Subject, MongoAbility } from '@casl/ability';
import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { Role } from '@prisma/client';
import { Request } from 'express';
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

export interface ModuleOptionsForFeature {
  permissions: PermissionsByRoles;
}

export interface PermissionGuardOptions {
  action: AppActions;
  subjectClass: AnyClass;
  subjectHook: AnyClass<SubjectHook>;
}

export interface SubjectHook {
  extractFromRequest(request: Request): Promise<AnyObject>;
}
