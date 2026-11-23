import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createUser(user: Pick<UserEntity, 'email' | 'password' | 'nickname'>) {
    const existsByEmail = await this.userRepo.exists({
      where: { email: user.email },
    });

    if (existsByEmail) {
      throw new ConflictException('이미 사용중인 이메일 입니다.');
    }

    const existsByNickname = await this.userRepo.exists({
      where: { nickname: user.nickname },
    });

    if (existsByNickname) {
      throw new ConflictException('이미 사용중인 닉네임 입니다.');
    }

    const newUser = this.userRepo.create({
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    });

    const saveUser = await this.userRepo.save(newUser);

    return saveUser;
  }
}
