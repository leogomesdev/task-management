import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      return await this.taskRepository.findOneOrFail({ id, userId: user.id });
    } catch {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const result: UpdateResult = await this.taskRepository.update(
      id,
      updateTaskDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return this.getTaskById(id, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result: DeleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
