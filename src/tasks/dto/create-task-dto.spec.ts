import MockFactory from '../../test/mock.factory';
import { CreateTaskDto } from './create-task-dto';

describe('CreateTaskDto', () => {
  const createTaskDto: CreateTaskDto = MockFactory.createTaskDto();

  it('contains title property as string', () => {
    expect(typeof createTaskDto.title).toBe('string');
  });

  it('contains description property as string', () => {
    expect(typeof createTaskDto.description).toBe('string');
  });
});
