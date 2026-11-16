import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message: string | string[] }).message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '문제가 생겼습니다. 다음에 다시 시도해주세요';
      // 사용자에게는 고정 문구만 보내므로, 실제 원인은 서버 로그에만 남긴다.
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      // 404 등은 문자열, 검증 실패(400)는 배열로 오기 때문에 항상 string[]으로 맞춘다.
      message: Array.isArray(message) ? message : [message],
    });
  }
}
