import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      `"$value" is an invalid status. ` +
      `The allowed values are: ${Object.keys(TaskStatus)}`,
  })
  status?: TaskStatus;
}
