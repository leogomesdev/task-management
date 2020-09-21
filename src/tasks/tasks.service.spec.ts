import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import MockFactory from '../test/mock.factory';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOneOrFail: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  });

  const mockUser: User = MockFactory.user();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    const expectedResults: Task[] = [];
    expectedResults.push(MockFactory.task());
    expectedResults.push(MockFactory.task());

    it('calls taskRepository.getTasks()', async () => {
      taskRepository.getTasks = jest.fn().mockResolvedValue(expectedResults);

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };

      await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
    });

    it('returns all tasks from repository', async () => {
      taskRepository.getTasks = jest.fn().mockResolvedValue(expectedResults);

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };

      const result = await tasksService.getTasks(filters, mockUser);

      expect(result).toEqual(expectedResults);
    });
  });

  describe('getTaskById', () => {
    const mockTask: Task = MockFactory.task();

    it('calls taskRepository.findOneOrFail()', async () => {
      taskRepository.findOneOrFail = jest.fn().mockResolvedValue(mockTask);

      await tasksService.getTaskById(mockTask.id, mockUser);

      expect(taskRepository.findOneOrFail).toHaveBeenCalledWith({
        id: mockTask.id,
        userId: mockUser.id,
      });
    });

    it('when the task is found, returns it', async () => {
      taskRepository.findOneOrFail = jest.fn().mockResolvedValue(mockTask);

      const result: Task = await tasksService.getTaskById(
        mockTask.id,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });

    it("when the task isn't found, throws an error", async () => {
      taskRepository.findOneOrFail = jest.fn().mockImplementation(() => {
        throw new Error('Not found');
      });

      expect(tasksService.getTaskById('xpto', mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "xpto" not found`),
      );
    });
  });

  describe('createTask', () => {
    const mockTask: Task = MockFactory.task();
    const mockCreateTaskDto: CreateTaskDto = MockFactory.createTaskDto();

    it('calls taskRepository.createTask()', async () => {
      taskRepository.createTask = jest.fn().mockResolvedValue(mockTask);

      await tasksService.createTask(mockCreateTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUser,
      );
    });

    it('returns the created task', async () => {
      taskRepository.createTask = jest.fn().mockResolvedValue(mockTask);

      const result: Task = await tasksService.createTask(
        mockCreateTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    const mockTask: Task = MockFactory.task();
    const deleteResultMock: DeleteResult = {
      affected: 1,
      raw: {},
    };

    it('when task is deleted, resolves the promise', async () => {
      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      await expect(tasksService.deleteTask(mockTask.id, mockUser)).resolves;
    });

    it('calls taskRepository.delete() to delete a task', async () => {
      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      await tasksService.deleteTask(mockTask.id, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: mockTask.id,
        userId: mockUser.id,
      });
    });

    it("when task isn't found, throws an error", async () => {
      deleteResultMock.affected = 0;

      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      expect(tasksService.deleteTask(mockTask.id, mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "${mockTask.id}" not found`),
      );
    });
  });

  describe('updateTask', () => {
    const mockTask: Task = MockFactory.task();
    const updateResultMock: UpdateResult = {
      affected: 1,
      raw: {},
      generatedMaps: [],
    };
    const updateTaskDto: UpdateTaskDto = {
      status: TaskStatus.IN_PROGRESS,
    };

    it('calls taskRepository.update() to update a task', async () => {
      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      await tasksService.updateTask(mockTask.id, updateTaskDto, mockUser);

      expect(taskRepository.update).toHaveBeenCalledWith(
        { id: mockTask.id, userId: mockUser.id },
        updateTaskDto,
      );
    });

    it('returns the updated task', async () => {
      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
      });

      const result = await tasksService.updateTask(
        mockTask.id,
        updateTaskDto,
        mockUser,
      );
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });

    it("when task isn't found, throws an error", async () => {
      updateResultMock.affected = 0;

      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      await expect(
        tasksService.updateTask(mockTask.id, updateTaskDto, mockUser),
      ).rejects.toThrow(
        new NotFoundException(`Task with ID "${mockTask.id}" not found`),
      );
    });
  });
});
