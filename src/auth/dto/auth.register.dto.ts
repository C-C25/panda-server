import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail(
    {},
    {
      message: '이메일 형식이 아닙니다.',
    },
  )
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(8)
  nickname!: string;
}
