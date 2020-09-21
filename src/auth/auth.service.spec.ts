import {
  ConflictException,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import MockFactory from '../test/mock.factory';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user-dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: UserRepository;
  let mockUser: User;
  const mockLogger: LoggerService = MockFactory.loggerService();

  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  const mockUserRepository = () => ({
    registerNewUser: jest.fn(),
    validateUserPassword: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    module.useLogger(mockLogger);

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
    mockUser = MockFactory.user();
  });

  describe('signUp', () => {
    const createUserDto: CreateUserDto = MockFactory.createUserDto();

    it('calls userRepository.registerNewUser()', async () => {
      userRepository.registerNewUser = jest.fn().mockResolvedValue(mockUser);

      await authService.signUp(createUserDto);

      expect(userRepository.registerNewUser).toHaveBeenCalled();
      expect(userRepository.registerNewUser).toHaveBeenCalledWith(
        createUserDto,
      );
    });

    it('returns the created User', async () => {
      userRepository.registerNewUser = jest.fn().mockResolvedValue(mockUser);

      const result: User = await authService.signUp(createUserDto);

      expect(result).toEqual(mockUser);
    });

    it('when userRepository.registerNewUser() throws an exception, it throws this too', async () => {
      const exception: ConflictException = new ConflictException(
        'Username already exists',
      );
      userRepository.registerNewUser = jest.fn().mockRejectedValue(exception);

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        exception,
      );
    });
  });

  describe('signIn', () => {
    const authCredentialsDto: AuthCredentialsDto = MockFactory.authCredentialsDto();

    it('calls userRepository.validateUserPassword()', async () => {
      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue(mockUser);

      await authService.signIn(authCredentialsDto);

      expect(userRepository.validateUserPassword).toHaveBeenCalledTimes(1);
      expect(userRepository.validateUserPassword).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });

    it('when the credentials are invalid, throws an UnauthorizedException', async () => {
      const exception: UnauthorizedException = new UnauthorizedException(
        'Invalid credentials',
      );
      userRepository.validateUserPassword = jest.fn().mockResolvedValue(null);

      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        exception,
      );
    });

    it('when the credentials are valid, returns the created token', async () => {
      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue(mockUser);

      const accessToken: string =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk4NTc1ZDZmLTc5NjQtNGNjNy' +
        '1hNTkxLTI1MjBiZjRjNWI3MyIsInVzZXJuYW1lIjoibGdvbWVzIiwiaWF0IjoxNTk5MDkwO' +
        'TQzLCJleHAiOjUxOTkwOTA5NDN9.JPVydCJqApcY1CBLetZAigBKM7TnOYvmfTWva1RVC8g';

      jwtService.sign = jest.fn().mockResolvedValue(accessToken);

      const result: { accessToken: string } = await authService.signIn(
        authCredentialsDto,
      );

      expect(result).toEqual({ accessToken });
    });

    it('when token is created, logs the used payload as a debug message', async () => {
      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue(mockUser);

      const accessToken: string =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk4NTc1ZDZmLTc5NjQtNGNjNy' +
        '1hNTkxLTI1MjBiZjRjNWI3MyIsInVzZXJuYW1lIjoibGdvbWVzIiwiaWF0IjoxNTk5MDkwO' +
        'TQzLCJleHAiOjUxOTkwOTA5NDN9.JPVydCJqApcY1CBLetZAigBKM7TnOYvmfTWva1RVC8g';

      jwtService.sign = jest.fn().mockResolvedValue(accessToken);

      const result: { accessToken: string } = await authService.signIn(
        authCredentialsDto,
      );

      const logMessage = `Generated JWT with payload ${JSON.stringify({
        id: mockUser.id,
        username: mockUser.username,
      })}`;

      expect(mockLogger.debug).toHaveBeenCalledWith(
        logMessage,
        'AuthService',
        false,
      );

      expect(result).toEqual({ accessToken });
    });
  });
});
