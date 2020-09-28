import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus, {
    message:
      `"$value" is an invalid status. ` +
      `The allowed values are: ${Object.keys(TaskStatus)}`,
  })
  status: TaskStatus;
}
