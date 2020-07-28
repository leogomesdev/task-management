import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.registerNewUser(authCredentialsDto);
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user: User = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { id: user.id, username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT with payload ${JSON.stringify(payload)}`);

    return { accessToken };
  }
}
