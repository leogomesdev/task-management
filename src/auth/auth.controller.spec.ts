import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import MockFactory from '../test/mock.factory';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateUserDto } from './dto/create-user-dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  const mockAuthService = () => ({
    signUp: jest.fn(),
    signIn: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: mockAuthService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    const createUserDto: CreateUserDto = MockFactory.createUserDto();

    it('calls authService.signUp()', async () => {
      await authController.signUp(createUserDto);

      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });

    it('returns the created User', async () => {
      const createdUser: User = MockFactory.user();

      authService.signUp = jest.fn().mockResolvedValue(createdUser);

      const result: User = await authController.signUp(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it('when authService.signUp() throws an exception, it throws this too', async () => {
      const exception: ConflictException = new ConflictException(
        'Username already exists',
      );
      authService.signUp = jest.fn().mockRejectedValue(exception);

      await expect(authController.signUp(createUserDto)).rejects.toThrow(
        exception,
      );
    });
  });

  describe('signIn', () => {
    const authCredentialsDto: AuthCredentialsDto = MockFactory.authCredentialsDto();

    it('calls authService.signIn()', async () => {
      await authController.signIn(authCredentialsDto);

      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(authCredentialsDto);
    });

    it('when the credentials are valid, returns the created token', async () => {
      const generatedToken: { accessToken: string } = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk4NTc1ZDZmLTc5NjQtNGNjNy' +
          '1hNTkxLTI1MjBiZjRjNWI3MyIsInVzZXJuYW1lIjoibGdvbWVzIiwiaWF0IjoxNTk5MDkwO' +
          'TQzLCJleHAiOjUxOTkwOTA5NDN9.JPVydCJqApcY1CBLetZAigBKM7TnOYvmfTWva1RVC8g',
      };

      authService.signIn = jest.fn().mockResolvedValue(generatedToken);

      const result: { accessToken: string } = await authController.signIn(
        authCredentialsDto,
      );

      expect(result).toEqual(generatedToken);
    });

    it('when authService.signIn() throws an exception, it throws this too', async () => {
      const exception: UnauthorizedException = new UnauthorizedException(
        'Invalid credentials',
      );
      authService.signIn = jest.fn().mockRejectedValue(exception);

      await expect(authController.signIn(authCredentialsDto)).rejects.toThrow(
        exception,
      );
    });
  });
});
