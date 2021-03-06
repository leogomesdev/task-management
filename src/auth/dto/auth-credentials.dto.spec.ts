import { validateOrReject, ValidationError } from 'class-validator';
import MockFactory from '../../test/mock.factory';
import { AuthCredentialsDto } from './auth-credentials.dto';

describe('AuthCredentialsDto', () => {
  let authCredentialsDto: AuthCredentialsDto;
  beforeEach(() => {
    authCredentialsDto = MockFactory.authCredentialsDto();
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
    delete authCredentialsDto.username;

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
    delete authCredentialsDto.password;

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
