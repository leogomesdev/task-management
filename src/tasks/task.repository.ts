import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const {
      status,
      search,
    }: { status: TaskStatus; search: string } = filterDto;
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

    return query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description,
    }: { title: string; description: string } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;
    delete task.userId;

    return task;
  }
}
