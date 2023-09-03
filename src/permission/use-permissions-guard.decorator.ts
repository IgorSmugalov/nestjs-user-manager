import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';
import {
  AppActions,
  PermissionGuardOptions,
  SubjectHook,
} from './permission.interface';
import { AnyClass } from '@casl/ability/dist/types/types';
import { PERMISSIONS_GUARD_CONFIG } from './permission.const';

export function UsePermissionsGuard(
  action: AppActions,
  subjectClass: AnyClass,
  subjectHook: AnyClass<SubjectHook>,
) {
  return applyDecorators(
    SetMetadata<string, PermissionGuardOptions>(PERMISSIONS_GUARD_CONFIG, {
      action,
      subjectClass,
      subjectHook,
    }),
    UseGuards(PermissionsGuard),
  );
}
