import { Injectable } from '@nestjs/common';
import { Subject, ForbiddenError } from '@casl/ability';
import { AbilityFactory } from './permissions.factory';
import { AuthenticatedUserDTO } from 'src/auth';
import { AccessForbiddenException } from './permissio.exceptions';
import { AppActions } from './permission.interface';

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

    const permittedFieldsOfAbility =
      this.abilityFactory.definePermittedFieldForAbility(
        abilities,
        action,
        subject,
      );
    console.log(permittedFieldsOfAbility);
    if (permittedFieldsOfAbility.length > 0) {
      const subjectFields = Object.keys(subject);
      subjectFields.forEach((field) => {
        try {
          ForbiddenError.from(abilities).throwUnlessCan(action, subject, field);
        } catch (error) {
          throw new AccessForbiddenException();
        }
      });
      console.log(subjectFields);
    }
    return abilities.can(action, subject);
  }
}
