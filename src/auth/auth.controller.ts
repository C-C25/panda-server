import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { LocalGuard } from './guard/auth.login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async postRegister(@Body() dto: AuthRegisterDto) {
    return await this.authService.registerWithEmail(dto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200) // 201 Created 가 아닌 새 리소스를 만들지 않고 기존 사용자를 인증하는 요청이라 200
  @Post('/login')
  async postLogin(@Req() req) {
    return this.authService.issueTokens(req.user.id);
  }
}
