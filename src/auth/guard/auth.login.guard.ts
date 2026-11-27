import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  LOGIN_FAILED_MESSAGE,
  MISSING_CREDENTIALS_MESSAGE,
} from '../../common/const/env-keys-values';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err) throw err;

    if (info?.message === 'Missing credentials') {
      throw new BadRequestException(MISSING_CREDENTIALS_MESSAGE);
    }

    if (!user) throw new UnauthorizedException(LOGIN_FAILED_MESSAGE);

    return user;
  }
}
