import { ValidationError, validateOrReject } from 'class-validator';
import MockFactory from '../../test/mock.factory';
import { UpdateTaskDto } from './update-task-dto';

describe('UpdateTaskDto', () => {
  let updateTaskDto: UpdateTaskDto;
  beforeEach(() => {
    updateTaskDto = MockFactory.updateTaskDto();
  });

  it('when title is empty, throws an validation error', async () => {
    updateTaskDto.title = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'title should not be empty',
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when title is not setted, throws an validation error', async () => {
    delete updateTaskDto.title;

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'title should not be empty',
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when description is empty, throws an validation error', async () => {
    updateTaskDto.description = '';

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'description should not be empty',
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when description is not setted, throws an validation error', async () => {
    delete updateTaskDto.description;

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isNotEmpty: 'description should not be empty',
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when status is invalid, throws an validation error', async () => {
    // @ts-ignore-start
    updateTaskDto.status = 'XPTO';
    // @ts-ignore-end

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isEnum:
          `"XPTO" is an invalid status. ` +
          `The allowed values are: OPEN,IN_PROGRESS,DONE`,
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it('when status is not setted, throws an validation error', async () => {
    delete updateTaskDto.status;

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isEnum:
          `"$value" is an invalid status. ` +
          `The allowed values are: OPEN,IN_PROGRESS,DONE`,
      },
    };

    await validateOrReject(updateTaskDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("when title, description, and status are valids, doesn't throws", async () => {
    let validationErrors: any = undefined;

    await validateOrReject(updateTaskDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });
});
