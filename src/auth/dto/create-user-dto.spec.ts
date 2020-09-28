import { validateOrReject, ValidationError } from 'class-validator';
import MockFactory from '../../test/mock.factory';
import { CreateUserDto } from './create-user-dto';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;
  beforeEach(() => {
    createUserDto = MockFactory.createUserDto();
  });

  it("when password doesn't have 1 upper case latter, throws an validation error", async () => {
    createUserDto.password = 'a1asoakmja2';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        matches:
          'password must contains: 1 upper case letter; 1 lower case letter; 1 number or special character',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when password doesn't have 1 lower case latter, throws an validation error", async () => {
    createUserDto.password = 'A1JSUOSDAYB1';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        matches:
          'password must contains: 1 upper case letter; 1 lower case letter; 1 number or special character',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when password doesn't have at least 8 characters, throws an validation error", async () => {
    createUserDto.password = 'aBC1234';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        minLength: 'password must be longer than or equal to 8 characters',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when password doesn't have 1 number or special character, throws an validation error", async () => {
    createUserDto.password = 'mySuperPassword';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        matches:
          'password must contains: 1 upper case letter; 1 lower case letter; 1 number or special character',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when username doesn't have at least 4 characters, throws an validation error", async () => {
    createUserDto.username = 'usu';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        minLength: 'username must be longer than or equal to 4 characters',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when username has more then 20 characters, throws an validation error', async () => {
    createUserDto.username = '123456789012345678901';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        maxLength: 'username must be shorter than or equal to 20 characters',
      },
    };

    await validateOrReject(createUserDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });
    expect(error).toMatchObject(expectedError);
  });

  it("when username and password are valids, doesn't throws", async () => {
    let validationErrors: any = undefined;

    await validateOrReject(createUserDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });
});
