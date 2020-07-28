import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return this.authService.signup(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(
      new ValidationPipe({
        exceptionFactory: () =>
          new UnauthorizedException('Invalid credentials'),
      }),
    )
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signin(authCredentialsDto);
  }
}
