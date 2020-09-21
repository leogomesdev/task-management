import { TaskStatusValidationPipe } from './task-status-validation.pipe';
import { TaskStatus } from '../task-status.enum';
import { BadRequestException } from '@nestjs/common';

describe('TaskStatusValidationPipe', () => {
  it('accepts the value OPEN', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();

    expect(taskStatusValidationPipe.transform(TaskStatus.OPEN)).toEqual(
      TaskStatus.OPEN,
    );
  });

  it('accepts the value IN_PROGRESS', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();

    expect(taskStatusValidationPipe.transform(TaskStatus.IN_PROGRESS)).toEqual(
      TaskStatus.IN_PROGRESS,
    );
  });

  it('accepts the value DONE', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();

    expect(taskStatusValidationPipe.transform(TaskStatus.DONE)).toEqual(
      TaskStatus.DONE,
    );
  });

  it('when value is undefined, throws an error', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();
    const value = undefined;

    const expectedException = new BadRequestException(
      `"${value}" is an invalid status. ` +
        `The allowed values are: ${Object.keys(TaskStatus)}`,
    );
    expect(() => taskStatusValidationPipe.transform(value)).toThrow(
      expectedException,
    );
  });

  it('when value is null, throws an error', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();
    const value = null;

    const expectedException = new BadRequestException(
      `"${value}" is an invalid status. ` +
        `The allowed values are: ${Object.keys(TaskStatus)}`,
    );
    expect(() => taskStatusValidationPipe.transform(value)).toThrow(
      expectedException,
    );
  });

  it('when value is an empty string, throws an error', () => {
    const taskStatusValidationPipe: TaskStatusValidationPipe = new TaskStatusValidationPipe();
    const value = '';

    const expectedException = new BadRequestException(
      `"${value}" is an invalid status. ` +
        `The allowed values are: ${Object.keys(TaskStatus)}`,
    );
    expect(() => taskStatusValidationPipe.transform(value)).toThrow(
      expectedException,
    );
  });
});
