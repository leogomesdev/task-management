import MockFactory from '../test/mock.factory';
import { User } from './user.entity';

describe('UserEntity', () => {
  const user: User = MockFactory.user();

  it('contains id property as string', () => {
    expect(typeof user.id).toBe('string');
  });

  it('contains username property as string', () => {
    expect(typeof user.username).toBe('string');
  });

  it('contains password property as string', () => {
    expect(typeof user.password).toBe('string');
  });
});
