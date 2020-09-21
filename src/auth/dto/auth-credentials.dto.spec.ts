import { validateOrReject, ValidationError } from 'class-validator';
import MockFactory from '../../test/mock.factory';
import { AuthCredentialsDto } from './auth-credentials.dto';

describe('AuthCredentialsDto', () => {
  let authCredentialsDto: AuthCredentialsDto;
  beforeEach(() => {
    authCredentialsDto = MockFactory.authCredentialsDto();
  });

  it('contains username property as string', () => {
    expect(typeof authCredentialsDto.username).toBe('string');
  });

  it('contains password property as string', () => {
    expect(typeof authCredentialsDto.password).toBe('string');
  });

  it('when username is empty, throws an validation error', async () => {
    authCredentialsDto.username = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'username is required',
      },
    };

    await validateOrReject(authCredentialsDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when username is not setted, throws an validation error', async () => {
    authCredentialsDto = new AuthCredentialsDto();
    authCredentialsDto.password = 'ABc123##';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'username is required',
      },
    };

    await validateOrReject(authCredentialsDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when password is empty, throws an validation error', async () => {
    authCredentialsDto.password = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'password is required',
      },
    };

    await validateOrReject(authCredentialsDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when password is not setted, throws an validation error', async () => {
    authCredentialsDto = new AuthCredentialsDto();
    authCredentialsDto.username = 'user_1234';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'password is required',
      },
    };

    await validateOrReject(authCredentialsDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });
});
