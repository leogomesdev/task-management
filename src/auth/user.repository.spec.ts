import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockUser: User = new User();
  mockUser.id = '3a62ae02-16e1-44de-bb25-e47371ea6100';
  mockUser.username = 'TestUser1';

  const mockAuthCredentialsDto: AuthCredentialsDto = {
    username: 'testusername',
    password: 'mypassworD12#',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerNewUser', () => {
    let save: jest.MockedFunction<any>;
    let mockedResultsForGetRawOne: jest.MockedFunction<any>;

    beforeEach(() => {
      save = jest.fn();

      userRepository.create = jest.fn().mockReturnValue({ save });

      const createQueryBuilderMock: any = {
        select: () => createQueryBuilderMock,
        where: () => createQueryBuilderMock,
        getRawOne: () => mockedResultsForGetRawOne,
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
    });

    describe("case username isn't in use", () => {
      it('successfully registers a new user', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '0',
        };

        save.mockResolvedValue(mockUser);

        await expect(
          userRepository.registerNewUser(mockAuthCredentialsDto),
        ).resolves.not.toThrow();
      });

      it('calls bcrypt.hash to hash the password', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '0',
        };

        bcrypt.hash = jest.fn().mockResolvedValue('testHash');

        save.mockResolvedValue(mockUser);

        await userRepository.registerNewUser(mockAuthCredentialsDto);

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith('mypassworD12#', 10);
      });
    });

    describe('case username is already in use', () => {
      it('throws a ConflictException ', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '1',
        };

        await expect(
          userRepository.registerNewUser(mockAuthCredentialsDto),
        ).rejects.toThrow(new ConflictException('Username already exists'));
      });

      it('must not call bcrypt.hash to hash the password', async () => {
        mockedResultsForGetRawOne = {
          userWithSameUsername: '1',
        };

        bcrypt.hash = jest.fn().mockResolvedValue('testHash');

        await expect(
          userRepository.registerNewUser(mockAuthCredentialsDto),
        ).rejects.toThrow();

        expect(bcrypt.hash).not.toHaveBeenCalled();
      });
    });

    it('case save() throws an error with code 23505, throws a ConflictException', async () => {
      mockedResultsForGetRawOne = {
        userWithSameUsername: '0',
      };

      save.mockRejectedValue({ code: '23505' });

      await expect(
        userRepository.registerNewUser(mockAuthCredentialsDto),
      ).rejects.toThrow(new ConflictException('Username already exists'));
    });

    it('case save() throws an unknown error, throws this error', async () => {
      mockedResultsForGetRawOne = {
        userWithSameUsername: '0',
      };

      save.mockRejectedValue(new Error('Unhandled error'));

      await expect(
        userRepository.registerNewUser(mockAuthCredentialsDto),
      ).rejects.toThrow(new Error('Unhandled error'));
    });
  });

  describe('validateUserPassword', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.username = 'TestUsername';
    });

    it('case validation is successfully, returns the User', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toEqual(user);
    });

    it('case user cannot be found, returns null', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('case password is incorrect, returns null', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result: User = await userRepository.validateUserPassword(
        mockAuthCredentialsDto,
      );
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
