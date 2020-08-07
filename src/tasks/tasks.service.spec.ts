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

  const mockUser: User = new User();
  mockUser.id = '3a62ae02-16e1-44de-bb25-e47371ea6100';
  mockUser.username = 'TestUser1';

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
    it('calls taskRepository.getTasks()', async () => {
      const expectedResults: Task[] = [new Task(), new Task()];
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
      const expectedResults: Task[] = [new Task(), new Task()];
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
    it('calls taskRepository.findOneOrFail()', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';
      taskRepository.findOneOrFail = jest.fn().mockResolvedValue(mockTask);

      await tasksService.getTaskById(mockTask.id, mockUser);

      expect(taskRepository.findOneOrFail).toHaveBeenCalledWith({
        id: mockTask.id,
        userId: mockUser.id,
      });
    });

    it('case the task is found, returns it', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';
      taskRepository.findOneOrFail = jest.fn().mockResolvedValue(mockTask);

      const result: Task = await tasksService.getTaskById(
        mockTask.id,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });

    it("case the task isn't found, throws an error", async () => {
      taskRepository.findOneOrFail = jest.fn().mockImplementation(() => {
        throw new Error('Not found');
      });

      expect(tasksService.getTaskById('xpto', mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "xpto" not found`),
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask()', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const mockCreateTaskDto: CreateTaskDto = {
        title: 'Do the laundry',
        description: 'ASAP',
      };

      taskRepository.createTask = jest.fn().mockResolvedValue(mockTask);

      await tasksService.createTask(mockCreateTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUser,
      );
    });

    it('returns the created task', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const mockCreateTaskDto: CreateTaskDto = {
        title: 'Do the laundry',
        description: 'ASAP',
      };

      taskRepository.createTask = jest.fn().mockResolvedValue(mockTask);

      const result: Task = await tasksService.createTask(
        mockCreateTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('case task is deleted, resolves the promise', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const deleteResultMock: DeleteResult = {
        affected: 1,
        raw: {},
      };

      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      expect(tasksService.deleteTask(mockTask.id, mockUser)).resolves;
    });

    it('calls taskRepository.delete() to delete a task', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const deleteResultMock: DeleteResult = {
        affected: 1,
        raw: {},
      };

      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      await tasksService.deleteTask(mockTask.id, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: mockTask.id,
        userId: mockUser.id,
      });
    });

    it("case task isn't found, throws an error", async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const deleteResultMock: DeleteResult = {
        affected: 0,
        raw: {},
      };

      taskRepository.delete = jest.fn().mockResolvedValue(deleteResultMock);

      expect(tasksService.deleteTask(mockTask.id, mockUser)).rejects.toThrow(
        new NotFoundException(`Task with ID "${mockTask.id}" not found`),
      );
    });
  });

  describe('updateTask', () => {
    it('calls taskRepository.update() to update a task', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';
      mockTask.status = TaskStatus.OPEN;

      const updateResultMock: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };

      await tasksService.updateTask(mockTask.id, updateTaskDto, mockUser);

      expect(taskRepository.update).toHaveBeenCalledWith(
        { id: mockTask.id, userId: mockUser.id },
        updateTaskDto,
      );
    });

    it('returns the updated task', async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';
      mockTask.status = TaskStatus.OPEN;

      const updateResultMock: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
      });

      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };

      const result = await tasksService.updateTask(
        mockTask.id,
        updateTaskDto,
        mockUser,
      );
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });

    it("case task isn't found, throws an error", async () => {
      const mockTask: Task = new Task();
      mockTask.id = '75f64cb1-a748-4115-9979-65dc056ce921';

      const updateResultMock: UpdateResult = {
        affected: 0,
        raw: {},
        generatedMaps: [],
      };
      taskRepository.update = jest.fn().mockResolvedValue(updateResultMock);

      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };

      expect(
        tasksService.updateTask(mockTask.id, updateTaskDto, mockUser),
      ).rejects.toThrow(
        new NotFoundException(`Task with ID "${mockTask.id}" not found`),
      );
    });
  });
});
