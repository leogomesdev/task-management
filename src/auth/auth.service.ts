import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async registerNewUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.registerNewUser(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const username: string = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
