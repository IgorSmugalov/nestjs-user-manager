import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { PermissionService } from './permission.service';
import { plainToInstance } from 'class-transformer';
import { Subject } from '@casl/ability';
import { AnyClass } from '@casl/ability/dist/types/types';
import { Reflector } from '@nestjs/core';
import { AppActions } from './permissions.factory';
import { PERMISSIONS_GUARD_CONFIG } from './permission.const';
import { AccessForbiddenException } from './permissio.exceptions';

export interface PermissionGuardOptions {
  action: AppActions;
  subjectClass: AnyClass<Subject>;
  getSubject: (req: Request) => Record<string, any>;
}

export function ConfigurateRBAC(
  action: AppActions,
  subjectClass: AnyClass<Subject>,
  getSubject: (req: Request) => Record<string, any>,
): CustomDecorator {
  return SetMetadata<string, PermissionGuardOptions>(PERMISSIONS_GUARD_CONFIG, {
    action,
    subjectClass,
    getSubject,
  });
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private accessService: PermissionService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const { action, subjectClass, getSubject } =
      this.reflector.get<PermissionGuardOptions>(
        PERMISSIONS_GUARD_CONFIG,
        context.getHandler(),
      );
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request;

    const subjectInstance = plainToInstance(subjectClass, getSubject(request), {
      ignoreDecorators: true,
    });

    if (!user || user.roles.length < 1) throw new AccessForbiddenException();

    // if (request.user.roles.includes('superadmin')) return true;

    const userCan = this.accessService.isCanAccess(
      user,
      action,
      subjectInstance,
    );
    if (userCan) return true;
    throw new AccessForbiddenException();
  }
}
