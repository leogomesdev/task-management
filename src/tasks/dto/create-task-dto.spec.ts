import { ValidationError, validateOrReject } from 'class-validator';
import MockFactory from '../../test/mock.factory';
import { CreateTaskDto } from './create-task-dto';

describe('CreateTaskDto', () => {
  let createTaskDto: CreateTaskDto;
  beforeEach(() => {
    createTaskDto = MockFactory.createTaskDto();
  });

  it('when title is empty, throws an validation error', async () => {
    createTaskDto.title = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'title should not be empty',
      },
    };

    await validateOrReject(createTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when title is not setted, throws an validation error', async () => {
    delete createTaskDto.title;

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'title should not be empty',
      },
    };

    await validateOrReject(createTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when description is empty, throws an validation error', async () => {
    createTaskDto.description = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'description should not be empty',
      },
    };

    await validateOrReject(createTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when description is not setted, throws an validation error', async () => {
    delete createTaskDto.description;

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'description should not be empty',
      },
    };

    await validateOrReject(createTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when title and description are valids, doesn't throws", async () => {
    let validationErrors: any = undefined;

    await validateOrReject(createTaskDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });
});
