import { TaskStatus } from './task-status.enum';

describe('TaskStatusEnum', () => {
  const taskStatus: typeof TaskStatus = TaskStatus;

  it('contains 3 values', () => {
    expect(Object.keys(taskStatus).length).toBe(3);
  });

  it('contains the status OPEN', () => {
    expect(taskStatus.OPEN).toBe('OPEN');
  });

  it('contains the status IN_PROGRESS', () => {
    expect(taskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
  });

  it('contains the status DONE', () => {
    expect(taskStatus.DONE).toBe('DONE');
  });
});
