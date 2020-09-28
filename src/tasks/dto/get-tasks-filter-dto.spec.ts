import { validateOrReject, ValidationError } from 'class-validator';
import { GetTasksFilterDto } from './get-tasks-filter-dto';
import MockFactory from '../../test/mock.factory';

describe('GetTasksFilterDto', () => {
  let getTasksFilterDto: GetTasksFilterDto;
  beforeEach(() => {
    getTasksFilterDto = MockFactory.getTasksFilterDto();
  });

  it('when status is invalid, throws an validation error', async () => {
    // @ts-ignore-start
    getTasksFilterDto.status = 'XPTO';
    // @ts-ignore-end

    let error: ValidationError | null = null;
    const expectedError: Record<string, any> = {
      constraints: {
        isEnum:
          `"XPTO" is an invalid status. ` +
          `The allowed values are: OPEN,IN_PROGRESS,DONE`,
      },
    };

    await validateOrReject(getTasksFilterDto).catch(errors => {
      expect(errors).toHaveLength(1);
      error = errors[0];
    });

    expect(error).toMatchObject(expectedError);
  });

  it("doesn't requires status field", async () => {
    delete getTasksFilterDto.status;

    let validationErrors: any = undefined;

    await validateOrReject(getTasksFilterDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });

  it("doesn't requires search field", async () => {
    delete getTasksFilterDto.search;

    let validationErrors: any = undefined;

    await validateOrReject(getTasksFilterDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });

  it("doesn't requires search or status fields", async () => {
    delete getTasksFilterDto.search;
    delete getTasksFilterDto.status;

    let validationErrors: any = undefined;

    await validateOrReject(getTasksFilterDto).catch(errors => {
      validationErrors = errors;
    });

    expect(validationErrors).toBeUndefined();
  });
});
