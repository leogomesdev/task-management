import MockFactory from '../../test/mock.factory';
import { UpdateTaskDto } from './update-task-dto';

describe('UpdateTaskDto', () => {
  const updateTaskDto: UpdateTaskDto = MockFactory.updateTaskDto();

  it('contains title property as string', () => {
    expect(typeof updateTaskDto.title).toBe('string');
  });

  it('contains description property as string', () => {
    expect(typeof updateTaskDto.description).toBe('string');
  });

  it('contains description status as string', () => {
    expect(typeof updateTaskDto.status).toBe('string');
  });
});
