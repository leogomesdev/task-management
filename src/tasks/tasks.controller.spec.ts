import { LoggerService, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import MockFactory from '../test/mock.factory';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';

describe('TasksController', () => {
  let tasksService: TasksService;
  let tasksController: TasksController;

  const mockLogger: LoggerService = MockFactory.loggerService();

  const mockTaskService = () => ({
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  });

  const mockUser: User = MockFactory.user();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useFactory: mockTaskService }],
    }).compile();

    module.useLogger(mockLogger);

    tasksService = module.get<TasksService>(TasksService);
    tasksController = module.get<TasksController>(TasksController);
  });

  describe('getTasks', () => {
    const mockGetTasksFilterDto: GetTasksFilterDto = {
      status: TaskStatus.IN_PROGRESS,
    };

    it('calls tasksService.getTasks()', async () => {
      await tasksController.getTasks(mockGetTasksFilterDto, mockUser);

      expect(tasksService.getTasks).toHaveBeenCalledTimes(1);
      expect(tasksService.getTasks).toHaveBeenCalledWith(
        mockGetTasksFilterDto,
        mockUser,
      );
    });

    it('calls logger.verbose()', async () => {
      await tasksController.getTasks(mockGetTasksFilterDto, mockUser);

      expect(mockLogger.verbose).toHaveBeenCalled();
      expect(mockLogger.verbose).toHaveBeenCalledWith(
        `User "${
          mockUser.username
        }" retreiving all tasks. Filters: ${JSON.stringify(
          mockGetTasksFilterDto,
        )}`,
        'TasksController',
        false,
      );
    });

    it('returns the array of Tasks', async () => {
      const foundTasks: Task[] = [];
      foundTasks.push(MockFactory.task());
      foundTasks.push(MockFactory.task());

      tasksService.getTasks = jest.fn().mockResolvedValue(foundTasks);

      const result: Task[] = await tasksController.getTasks(
        mockGetTasksFilterDto,
        mockUser,
      );

      expect(result).toEqual(foundTasks);
    });
  });

  describe('getTaskById', () => {
    const id: string = uuidv4();

    it('calls tasksService.getTaskById()', async () => {
      await tasksController.getTaskById(id, mockUser);

      expect(tasksService.getTaskById).toHaveBeenCalledTimes(1);
      expect(tasksService.getTaskById).toHaveBeenCalledWith(id, mockUser);
    });

    it('when the Task is found, returns it', async () => {
      const task: Task = MockFactory.task();

      tasksService.getTaskById = jest.fn().mockResolvedValue(task);

      const result: Task = await tasksController.getTaskById(task.id, mockUser);

      expect(result).toEqual(task);
    });

    it('when tasksService.getTaskById() throws an exception, it throws this too', async () => {
      const exception: NotFoundException = new NotFoundException(
        `Task with ID "${id}" not found`,
      );
      tasksService.getTaskById = jest.fn().mockRejectedValue(exception);

      await expect(tasksController.getTaskById(id, mockUser)).rejects.toThrow(
        exception,
      );
    });
  });

  describe('createTask', () => {
    let createTaskDto: CreateTaskDto;
    beforeEach(() => {
      createTaskDto = MockFactory.createTaskDto();
    });

    it('calls tasksService.createTask()', async () => {
      await tasksController.createTask(createTaskDto, mockUser);

      expect(tasksService.createTask).toHaveBeenCalledTimes(1);
      expect(tasksService.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
    });

    it('calls logger.verbose()', async () => {
      await tasksController.createTask(createTaskDto, mockUser);

      expect(mockLogger.verbose).toHaveBeenCalled();
      expect(mockLogger.verbose).toHaveBeenCalledWith(
        `User ${
          mockUser.username
        } is creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
        'TasksController',
        false,
      );
    });

    it('returns the created Task', async () => {
      const createdTask: Task = MockFactory.task();

      tasksService.createTask = jest.fn().mockResolvedValue(createdTask);

      const result: Task = await tasksController.createTask(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    let updateTaskDto: UpdateTaskDto;
    beforeEach(() => {
      updateTaskDto = MockFactory.updateTaskDto();
    });

    it('calls tasksService.updateTask()', async () => {
      const id: string = uuidv4();

      await tasksController.updateTask(id, updateTaskDto, mockUser);

      expect(tasksService.updateTask).toHaveBeenCalledTimes(1);
      expect(tasksService.updateTask).toHaveBeenCalledWith(
        id,
        updateTaskDto,
        mockUser,
      );
    });

    it('returns the updated Task', async () => {
      const updatedTask: Task = MockFactory.task();
      updatedTask.status = updateTaskDto.status;

      tasksService.updateTask = jest.fn().mockResolvedValue(updatedTask);

      const result: Task = await tasksController.updateTask(
        updatedTask.id,
        updateTaskDto,
        mockUser,
      );

      expect(result).toEqual(updatedTask);
    });

    it('when tasksService.updateTask() throws an exception, it throws this too', async () => {
      const id: string = uuidv4();
      const exception: NotFoundException = new NotFoundException(
        `Task with ID "${id}" not found`,
      );
      tasksService.updateTask = jest.fn().mockRejectedValue(exception);

      await expect(
        tasksController.updateTask(id, updateTaskDto, mockUser),
      ).rejects.toThrow(exception);
    });
  });

  describe('updateTaskStatus', () => {
    const status: TaskStatus = TaskStatus.IN_PROGRESS;

    it('calls tasksService.updateTask()', async () => {
      const id: string = uuidv4();

      await tasksController.updateTaskStatus(id, status, mockUser);

      expect(tasksService.updateTask).toHaveBeenCalledTimes(1);
      expect(tasksService.updateTask).toHaveBeenCalledWith(
        id,
        { status },
        mockUser,
      );
    });

    it('returns the updated Task', async () => {
      const updatedTask: Task = MockFactory.task();
      updatedTask.status = status;

      tasksService.updateTask = jest.fn().mockResolvedValue(updatedTask);

      const result: Task = await tasksController.updateTaskStatus(
        updatedTask.id,
        status,
        mockUser,
      );

      expect(result).toEqual(updatedTask);
    });

    it('when tasksService.updateTask() throws an exception, it throws this too', async () => {
      const id: string = uuidv4();
      const exception: NotFoundException = new NotFoundException(
        `Task with ID "${id}" not found`,
      );
      tasksService.updateTask = jest.fn().mockRejectedValue(exception);

      await expect(
        tasksController.updateTaskStatus(id, status, mockUser),
      ).rejects.toThrow(exception);
    });
  });

  describe('deleteTask', () => {
    const id: string = uuidv4();

    it('calls tasksService.deleteTask()', async () => {
      await tasksController.deleteTask(id, mockUser);

      expect(tasksService.deleteTask).toHaveBeenCalledTimes(1);
      expect(tasksService.deleteTask).toHaveBeenCalledWith(id, mockUser);
    });

    it('when tasksService.deleteTask() throws an exception, it throws this too', async () => {
      const exception: NotFoundException = new NotFoundException(
        `Task with ID "${id}" not found`,
      );
      tasksService.deleteTask = jest.fn().mockRejectedValue(exception);

      await expect(tasksController.deleteTask(id, mockUser)).rejects.toThrow(
        exception,
      );
    });
  });
});
