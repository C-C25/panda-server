import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HASH_ROUND_KEY,
  ENV_JWT_ACCESS_SECRET_KEY,
  ENV_JWT_REFRESH_SECRET_KEY,
} from '../common/const/env-keys-values';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(userId: number, tokenType: 'access' | 'refresh') {
    const payload = {
      sub: userId,
      tokenType, // tokenType: tokenType,
    };

    return this.jwtService.sign(payload, {
      // 한쪽 시크릿이 유출돼도 다른 종류의 토큰은 위조할 수 없게
      secret:
        tokenType === 'access'
          ? this.configService.getOrThrow<string>(ENV_JWT_ACCESS_SECRET_KEY) // accessToken 만료 시간을 짧게 탈취 된다 한들 사용 범위 최소화
          : this.configService.getOrThrow<string>(ENV_JWT_REFRESH_SECRET_KEY), // refreshToken 저장하지 않는 방식이라 탈취 시 피해 시간을 줄이기 위해 짧게
      expiresIn: tokenType === 'access' ? '5m' : '1h',
    });
  }

  async registerWithEmail(dto: AuthRegisterDto) {
    const hash = await bcrypt.hash(
      dto.password,
      parseInt(this.configService.getOrThrow<string>(ENV_HASH_ROUND_KEY)),
    );

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hash,
    });

    // TODO t-04 진행시 return 토큰 발급으로 바로 로그인 가능 하게 변경
    return {
      email: newUser.email,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt,
    };
  }
}
