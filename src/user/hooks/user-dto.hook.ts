import { Request } from 'express';
import {
  HookSubjectsSet,
  SubjectHook,
} from 'src/permissions/permissions.interface';
import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UserService } from '../user.service';
import { UserDoesNotExistsException } from '../user.exceptions';

@Injectable()
export class UserDTOHook implements SubjectHook {
  constructor(private userService: UserService) {}
  async getSubjectData(request: Request): Promise<HookSubjectsSet> {
    const id = request.params.id;
    if (!isUUID(id)) throw new UserDoesNotExistsException();
    const user = await this.userService.getUnique({
      id,
    });
    return {
      enrichedSubject: user,
      subject: Object.assign(request.params, request.body),
    };
  }
}
