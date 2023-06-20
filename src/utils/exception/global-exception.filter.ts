import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, executionContext: ArgumentsHost) {
    const response: Response = executionContext.switchToHttp().getResponse();
    return response
      .status(exception.getStatus())
      .json(HttpException.createBody(exception.getResponse()));
  }
}
