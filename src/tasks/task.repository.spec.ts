import { InternalServerErrorException, LoggerService } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import MockFactory from '../test/mock.factory';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  const mockLogger: LoggerService = MockFactory.loggerService();
  const mockUser: User = MockFactory.user();
  const mockTask: Task = MockFactory.task();
  const mockCreateTaskDto: CreateTaskDto = MockFactory.createTaskDto();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRepository],
    }).compile();

    module.useLogger(mockLogger);

    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    let mockedResultsForGetMany: jest.MockedFunction<any>;
    let mockedWhere: jest.MockedFunction<any>;
    let mockedAndWhere: jest.MockedFunction<any>;
    let mockGetTasksFilterDto: GetTasksFilterDto;
    let createQueryBuilderMock: jest.MockedFunction<any>;

    beforeEach(() => {
      mockedWhere = jest.fn().mockResolvedValue(createQueryBuilderMock);
      mockedAndWhere = jest.fn().mockResolvedValue(createQueryBuilderMock);

      mockedResultsForGetMany = [new Task()];

      createQueryBuilderMock = {
        where: mockedWhere,
        andWhere: mockedAndWhere,
        getMany: () => mockedResultsForGetMany,
      };

      jest
        .spyOn(taskRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
    });

    it('filters the tasks based on id of the user', async () => {
      mockGetTasksFilterDto = {};
      await taskRepository.getTasks(mockGetTasksFilterDto, mockUser);

      expect(mockedWhere).toHaveBeenCalledTimes(1);
      expect(mockedWhere).toHaveBeenCalledWith('task.userId = :userId', {
        userId: mockUser.id,
      });
    });

    it('when filterDto contains the property status, adds it to the query', async () => {
      mockGetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
      };

      await taskRepository.getTasks(mockGetTasksFilterDto, mockUser);

      expect(mockedAndWhere).toHaveBeenCalledTimes(1);
      expect(mockedAndWhere).toHaveBeenCalledWith('task.status = :status', {
        status: mockGetTasksFilterDto.status,
      });
    });

    it('when filterDto contains the property search, adds it to the query', async () => {
      mockGetTasksFilterDto = {
        search: 'ab',
      };

      await taskRepository.getTasks(mockGetTasksFilterDto, mockUser);

      expect(mockedAndWhere).toHaveBeenCalledTimes(1);
      expect(
        mockedAndWhere,
      ).toHaveBeenCalledWith(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${mockGetTasksFilterDto.search}%` },
      );
    });

    it('when filterDto contains the properties: status and search, adds both to the query', async () => {
      mockGetTasksFilterDto = {
        search: 'abc',
        status: TaskStatus.OPEN,
      };

      await taskRepository.getTasks(mockGetTasksFilterDto, mockUser);

      expect(mockedAndWhere).toHaveBeenCalledTimes(2);
      expect(
        mockedAndWhere,
      ).toHaveBeenCalledWith(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${mockGetTasksFilterDto.search}%` },
      );
      expect(mockedAndWhere).toHaveBeenCalledWith('task.status = :status', {
        status: mockGetTasksFilterDto.status,
      });
    });

    it('returns the Tasks from getMany()', async () => {
      mockGetTasksFilterDto = {
        search: 'abc',
        status: TaskStatus.OPEN,
      };

      mockedResultsForGetMany = [new Task(), new Task()];

      const results: Task[] = await taskRepository.getTasks(
        mockGetTasksFilterDto,
        mockUser,
      );

      expect(results).toEqual(mockedResultsForGetMany);
    });

    describe('when getMany() throws any Error', () => {
      beforeEach(() => {
        jest.spyOn(createQueryBuilderMock, 'getMany').mockImplementation(() => {
          throw new Error('Unhandled error');
        });
      });

      it('throws an InternalServerErrorException', async () => {
        await expect(
          taskRepository.getTasks(mockGetTasksFilterDto, mockUser),
        ).rejects.toThrow(new InternalServerErrorException());
      });

      it('logs an error message', async () => {
        expect(
          taskRepository.getTasks(mockGetTasksFilterDto, mockUser),
        ).rejects.toThrow();

        const logMessage = `Failed to get tasks for user "${
          mockUser.username
        }". Filters: ${JSON.stringify(mockGetTasksFilterDto)}`;

        expect(mockLogger.error).toHaveBeenCalledWith(
          logMessage,
          'Unhandled error',
          'TaskRepository',
        );
      });
    });
  });

  describe('createTask', () => {
    let save: jest.MockedFunction<any>;

    beforeEach(() => {
      save = jest.fn();

      taskRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('calls task.save()', async () => {
      save.mockResolvedValue(mockTask);

      await taskRepository.createTask(mockCreateTaskDto, mockUser);
      expect(save).toHaveBeenCalled();
    });

    it(`returns the Task if save() doesn't throws`, async () => {
      save.mockResolvedValue(mockTask);

      const result: Task = await taskRepository.createTask(
        mockCreateTaskDto,
        mockUser,
      );

      expect(result).toMatchObject(mockCreateTaskDto);
    });

    describe('when task.save() throws any Error', () => {
      beforeEach(() => {
        save.mockImplementation(() => {
          throw new Error('Unhandled error');
        });
      });

      it('throws a new InternalServerErrorException', async () => {
        await expect(
          taskRepository.createTask(mockCreateTaskDto, mockUser),
        ).rejects.toThrow(new InternalServerErrorException());
      });

      it('logs an error message', async () => {
        await expect(
          taskRepository.createTask(mockCreateTaskDto, mockUser),
        ).rejects.toThrow();

        const logMessage: string =
          `Failed when creating a task for user "${mockUser.username}". ` +
          `Data: ${JSON.stringify(mockCreateTaskDto)}`;

        expect(mockLogger.error).toHaveBeenCalledWith(
          logMessage,
          'Unhandled error',
          'TaskRepository',
        );
      });
    });
  });
});
