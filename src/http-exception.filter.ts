import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Format any error message in REST APIs
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse() as Record<string, any>;
    const { statusCode, error } = exceptionResponse;
    const messages = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];

    response.status(statusCode).json({
      statusCode,
      messages,
      error,
    });
  }
}
