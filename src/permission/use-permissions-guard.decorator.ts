import { UseGuards, applyDecorators } from '@nestjs/common';
import { AnyClass, Subject } from '@casl/ability/dist/types/types';
import { Request } from 'express';
import { ConfigurateRBAC, PermissionsGuard } from './permissions.guard';
import { AppActions } from './permission.interface';

export function UsePermissionsGuard<T extends AnyClass<Subject>>(
  action: AppActions,
  subjectClass: T,
  getSubject: (req: Request) => Record<any, any>,
) {
  return applyDecorators(
    ConfigurateRBAC(action, subjectClass, getSubject),
    UseGuards(PermissionsGuard),
  );
}
