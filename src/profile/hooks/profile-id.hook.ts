import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import {
  HookSubjectsSet,
  SubjectHook,
} from 'src/permissions/permissions.interface';

@Injectable()
export class ProfileIdHook implements SubjectHook {
  getSubjectData(request: Request): HookSubjectsSet {
    return {
      subject: request.params,
    };
  }
}
