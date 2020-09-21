import MockFactory from '../test/mock.factory';
import { Task } from './task.entity';

describe('TaskEntity', () => {
  const task: Task = MockFactory.task();

  it('contains id property as string', () => {
    expect(typeof task.id).toBe('string');
  });

  it('contains title property as string', () => {
    expect(typeof task.title).toBe('string');
  });

  it('contains description property as string', () => {
    expect(typeof task.description).toBe('string');
  });

  it('contains status property as string', () => {
    expect(typeof task.status).toBe('string');
  });

  it('contains userId property as string', () => {
    expect(typeof task.userId).toBe('string');
  });
});
