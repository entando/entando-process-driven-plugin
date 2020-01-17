import { getTasks, getColumns } from 'api/pda/tasks';
import { DOMAINS } from 'api/constants';
import mockTasks from 'mocks/pda/tasks.json';
import COLUMNS from 'mocks/pda/columns';

describe('TaskList API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getTasks to return expected data', async () => {
    const connection = 'kieStaging';
    const url = `${DOMAINS.PDA}/connections/${connection}/tasks?page=1&pageSize=30`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await getTasks(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockTasks);
  });

  it('getColumns to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(COLUMNS));
    const result = await getColumns(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/tasks/columns`
    );
    expect(result).toEqual(COLUMNS);
  });
});
