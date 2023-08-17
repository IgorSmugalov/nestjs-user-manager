import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

@Injectable()
export class FromParamsSubjectHook implements SubjectBeforeFilterHook {
  async run(request: Request) {
    return request.params;
  }
}
