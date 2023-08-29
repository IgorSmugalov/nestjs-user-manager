import { Injectable } from '@nestjs/common';
import { Subject } from '@casl/ability';
import { AbilityFactory, AppActions } from './permissions.factory';
import { AuthenticatedUserDTO } from 'src/auth';

@Injectable()
export class PermissionService {
  constructor(private abilityFactory: AbilityFactory) {}

  public isCanAccess(
    user: AuthenticatedUserDTO,
    action: AppActions,
    subject: Subject,
  ): boolean {
    if (!user || !action || !subject) return false;
    const abilities = this.abilityFactory.defineAbilityFor(user);
    return abilities.can(action, subject);
  }
}
