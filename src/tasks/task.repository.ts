import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { serialize } from 'class-transformer';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private readonly logger = new Logger(TaskRepository.name);

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const {
      status,
      search,
    }: { status?: TaskStatus; search?: string } = filterDto;
    const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.message,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description,
    }: { title: string; description: string } = createTaskDto;
    const task: Task = this.create();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed when creating a task for user "${user.username}". ` +
          `Data: ${JSON.stringify(createTaskDto)}`,
        error.message,
      );
      throw new InternalServerErrorException();
    }

    this.logger.verbose(`Task created: ${serialize(task)}`);

    return task;
  }
}
