import { GetTasksFilterDto } from './get-tasks-filter-dto';
import { TaskStatus } from '../task-status.enum';

describe('GetTasksFilterDto', () => {
  const getTasksFilterDto: GetTasksFilterDto = {
    search: 'a',
    status: TaskStatus.OPEN,
  };

  it('contains search property as string', () => {
    expect(typeof getTasksFilterDto.search).toBe('string');
  });

  it('contains status property as string', () => {
    expect(typeof getTasksFilterDto.status).toBe('string');
  });
});
