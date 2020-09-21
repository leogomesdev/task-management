import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import MockFactory from '../test/mock.factory';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user-dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockUser: User = MockFactory.user();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('registerNewUser', () => {
    const createUserDto: CreateUserDto = MockFactory.createUserDto();

    let save: jest.MockedFunction<any>;
    let mockedResultsForGetRawOne: jest.MockedFunction<any>;

    const createQueryBuilderMock: any = {
      select: () => createQueryBuilderMock,
      where: () => createQueryBuilderMock,
      getRawOne: () => mockedResultsForGetRawOne,
    };

    beforeEach(() => {
      save = jest.fn();

      userRepository.create = jest.fn().mockReturnValue({ save });

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
    });

    describe("when username isn't in use", () => {
      it('successfully registers a new user', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '0',
        };

        save.mockResolvedValue(mockUser);

        await expect(
          userRepository.registerNewUser(createUserDto),
        ).resolves.not.toThrow();
      });

      it('calls bcrypt.hash to hash the password', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '0',
        };

        bcrypt.hash = jest.fn().mockResolvedValue('testHash');

        save.mockResolvedValue(mockUser);

        await userRepository.registerNewUser(createUserDto);

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      });
    });

    describe('when username is already in use', () => {
      it('throws a ConflictException ', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '1',
        };

        await expect(
          userRepository.registerNewUser(createUserDto),
        ).rejects.toThrow(new ConflictException('Username already exists'));
      });

      it('must not call bcrypt.hash to hash the password', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '1',
        };

        bcrypt.hash = jest.fn().mockResolvedValue('testHash');

        await expect(
          userRepository.registerNewUser(createUserDto),
        ).rejects.toThrow();

        expect(bcrypt.hash).not.toHaveBeenCalled();
      });
    });

    it('when save() throws an error with code 23505, throws a ConflictException', async () => {
      mockedResultsForGetRawOne = {
        userWithSameUsername: '0',
      };

      save.mockRejectedValue({ code: '23505' });

      await expect(
        userRepository.registerNewUser(createUserDto),
      ).rejects.toThrow(new ConflictException('Username already exists'));
    });

    it('when save() throws an unknown error, throws this error', async () => {
      mockedResultsForGetRawOne = {
        userWithSameUsername: '0',
      };

      save.mockRejectedValue(new Error('Unhandled error'));

      await expect(
        userRepository.registerNewUser(createUserDto),
      ).rejects.toThrow(new Error('Unhandled error'));
    });
  });

  describe('validateUserPassword', () => {
    const mockAuthCredentialsDto: AuthCredentialsDto = MockFactory.authCredentialsDto();

    it('when validation is successfully, returns the User', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toEqual(mockUser);
    });

    it('when user cannot be found, returns null', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('when password is incorrect, returns null', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
