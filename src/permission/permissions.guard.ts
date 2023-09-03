import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PermissionService } from './permission.service';
import { plainToInstance } from 'class-transformer';
import { ModuleRef, Reflector } from '@nestjs/core';
import { PERMISSIONS_GUARD_CONFIG } from './permission.const';
import { AccessForbiddenException } from './permissio.exceptions';
import { PermissionGuardOptions } from './permission.interface';
import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { subjectHookFactory } from './subject-hook.factory';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private accessService: PermissionService,
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { action, subjectClass, subjectHook } =
      this.reflector.get<PermissionGuardOptions>(
        PERMISSIONS_GUARD_CONFIG,
        context.getHandler(),
      );
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || user.roles.length === 0) throw new AccessForbiddenException();
    if (request.user.roles.includes('superadmin')) return true;

    const factory = await subjectHookFactory(this.moduleRef, subjectHook);
    const subjectInstance = this.buildSubject(
      subjectClass,
      await factory.extractFromRequest(request),
    );

    const isCan = this.accessService.canAccess(user, action, subjectInstance);
    if (isCan) return true;
    throw new AccessForbiddenException();
  }

  private buildSubject(subjectClass: AnyClass, data: AnyObject): AnyClass {
    return plainToInstance(subjectClass, data, {
      ignoreDecorators: true,
    });
  }
}
