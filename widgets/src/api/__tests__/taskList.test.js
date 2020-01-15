import { getTasks, getProcess, getGroups, getColumns } from 'api/taskList';
import { DOMAINS } from 'api/constants';
import mockTasks from 'mocks/taskList/tasks.json';
import { PROCESS, GROUPS, COLUMNS } from 'mocks/taskList/configs';

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

  it('getProcess to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(PROCESS));
    const result = await getProcess(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/definitions`
    );
    expect(result).toEqual(PROCESS);
  });

  it('getGroups to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(GROUPS));
    const result = await getGroups(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${DOMAINS.PDA}/connections/${connection}/groups`);
    expect(result).toEqual(GROUPS);
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
