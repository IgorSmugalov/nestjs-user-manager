import { Injectable } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { AbilityFactory } from './permissions.factory';
import { AuthenticatedUserDTO } from 'src/auth';
import { AccessForbiddenException } from './permissio.exceptions';
import { AppActions } from './permission.interface';
import { AnyClass } from '@casl/ability/dist/types/types';

@Injectable()
export class PermissionService {
  constructor(private abilityFactory: AbilityFactory) {}

  public canAccess(
    user: AuthenticatedUserDTO,
    action: AppActions,
    subject: AnyClass,
  ): boolean {
    if (!user || !action || !subject) throw new AccessForbiddenException();
    const abilities = this.abilityFactory.defineAbilityForUser(user);
    const permittedFieldsOfAbility =
      this.abilityFactory.definePermittedFieldForAbility(
        abilities,
        action,
        subject,
      );
    if (permittedFieldsOfAbility.length > 0) {
      const subjectFields = Object.keys(subject);
      subjectFields.forEach((field) => {
        try {
          ForbiddenError.from(abilities).throwUnlessCan(action, subject, field);
        } catch (error) {
          throw new AccessForbiddenException();
        }
      });
    }
    if (!abilities.can(action, subject)) throw new AccessForbiddenException();
    return true;
  }
}
