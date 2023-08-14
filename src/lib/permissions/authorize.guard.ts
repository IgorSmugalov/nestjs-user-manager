import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { OWNER_KEY, ROLES_KEY } from './const';
import { Role } from '@prisma/client';

export type GetOwnerID = (req: Request) => string;
export type RequiredRoles = Role[];

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request;

    if (user.roles.includes(Role.superadmin)) return true;

    const permissions = {
      byRole: false,
      byOwner: false,
    };

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user.roles.some((role) => requiredRoles.includes(role))) {
      permissions.byRole = true;
    }

    const getOwnerId = this.reflector.getAllAndOverride<GetOwnerID>(OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (typeof getOwnerId === 'function' && user.id === getOwnerId(request)) {
      permissions.byOwner = true;
    }
    console.log(permissions);
    return Object.values(permissions).some((value) => value === true);
  }
}
