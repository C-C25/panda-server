import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENV_HASH_ROUND_KEY } from '../common/const/env-keys-values';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async registerWithEmail(dto: AuthRegisterDto) {
    const hash = await bcrypt.hash(
      dto.password,
      parseInt(this.configService.getOrThrow<string>(ENV_HASH_ROUND_KEY)),
    );

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hash,
    });

    return newUser;
    // TODO t-04 진행시 return 토큰 발급으로 바로 로그인 가능 하게 변경
  }
}
