import { LoggerService } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../tasks/task.entity';
import { TaskStatus } from '../tasks/task-status.enum';
import { CreateTaskDto } from '../tasks/dto/create-task-dto';
import { UpdateTaskDto } from '../tasks/dto/update-task-dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { CreateUserDto } from '../auth/dto/create-user-dto';

export default class MockFactory {
  static loggerService(): LoggerService {
    return {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
  }

  static user(): User {
    const user: User = new User();
    user.id = uuidv4();
    user.username = 'TestUser1';
    user.password = '1234L1a*';
    return user;
  }

  static task(): Task {
    const task: Task = new Task();
    task.id = uuidv4();
    task.title = 'Task Title';
    task.description = 'Task description';
    task.status = TaskStatus.OPEN;
    task.userId = uuidv4();
    return task;
  }

  static createTaskDto(): CreateTaskDto {
    const createTaskDto: CreateTaskDto = new CreateTaskDto();
    createTaskDto.title = 'Task Title';
    createTaskDto.description = 'Task description';

    return createTaskDto;
  }

  static updateTaskDto(): UpdateTaskDto {
    const updateTaskDto: UpdateTaskDto = new UpdateTaskDto();
    updateTaskDto.title = 'Task Title';
    updateTaskDto.description = 'Task description';
    updateTaskDto.status = TaskStatus.IN_PROGRESS;

    return updateTaskDto;
  }

  static authCredentialsDto(): AuthCredentialsDto {
    const authCredentialsDto: AuthCredentialsDto = new AuthCredentialsDto();
    authCredentialsDto.username = 'user_1234';
    authCredentialsDto.password = 'ABc123##';

    return authCredentialsDto;
  }

  static createUserDto(): CreateUserDto {
    const createUserDto: CreateUserDto = new CreateUserDto();
    createUserDto.username = 'user_1234';
    createUserDto.password = 'ABc123##';

    return createUserDto;
  }
}
