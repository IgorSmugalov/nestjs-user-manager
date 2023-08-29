import { Inject, Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  ExtractSubjectType,
  Subject,
  PureAbility,
  MatchConditions,
} from '@casl/ability';
import { AnyClass } from '@casl/ability/dist/types/types';
import { Role } from '@prisma/client';
import { AuthenticatedUserDTO } from 'src/auth';
import { PERMISSIONS_FEATURE_OPTIONS } from './permission.const';

export enum AppActions {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export type Roles = Role | 'everyone';

const conditionMatcher = (matchConditions: MatchConditions) => matchConditions;

export type DefinePermissionsForUser<T extends Subject = Subject> = (
  user: AuthenticatedUserDTO,
  builder: AbilityBuilder<PureAbility<[AppActions, T], MatchConditions<T>>>,
) => void;

export type Permissions<T extends Subject = Subject> = Partial<
  Record<Roles, DefinePermissionsForUser<T>>
>;

export interface OptionsForFeature {
  permissions: Permissions;
}

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(PERMISSIONS_FEATURE_OPTIONS)
    private options: OptionsForFeature,
  ) {}

  defineAbilityFor(user: AuthenticatedUserDTO) {
    const builder = new AbilityBuilder<
      PureAbility<[AppActions, Subject], MatchConditions>
    >(PureAbility);

    const { permissions } = this.options;

    if (permissions.everyone) {
      permissions.everyone(user, builder);
    }

    if (user.roles.length > 0) {
      user.roles?.forEach((role) => {
        if (typeof permissions[role] === 'function') {
          permissions[role](user, builder);
        }
      });
    }
    return builder.build({
      conditionsMatcher: conditionMatcher,
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<AnyClass<Subject>>,
    });
  }
}
