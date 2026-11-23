import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async postRegister(@Body() dto: AuthRegisterDto) {
    return await this.authService.registerWithEmail(dto);
  }
}
