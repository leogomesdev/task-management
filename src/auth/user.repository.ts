import { Repository, EntityRepository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user-dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async registerNewUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const usernameIsInUse: boolean = await this.usernameIsInUse(username);
    if (usernameIsInUse) {
      throw new ConflictException('Username already exists');
    }

    const user = this.create();
    user.username = username;
    user.password = await UserRepository.hashPassword(password);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user: User = await this.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  private async usernameIsInUse(username: string): Promise<boolean> {
    const { userWithSameUsername } = await this.createQueryBuilder('user')
      .where('user.username = :username', { username })
      .select('COUNT(1)', 'userWithSameUsername')
      .getRawOne();

    return userWithSameUsername === '1';
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
