import { getTasks, getConnections, getProcess, getGroups, getColumns } from 'api/taskList';

import mockTasks from 'mocks/taskList/tasks.json';
import { CONNECTIONS, PROCESS, GROUPS, COLUMNS } from 'mocks/taskList/configs';

describe('TaskList API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getTasks to return expected data', async () => {
    const connection = 'kieStaging';
    const url = `/connections/${connection}/tasks?sort=taskId`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await getTasks(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockTasks);
  });

  it('getConnections to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(CONNECTIONS));
    const result = await getConnections();

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual('/connections');
    expect(result).toEqual(CONNECTIONS);
  });

  it('getProcess to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(PROCESS));
    const result = await getProcess(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/connections/${connection}/processes/definitions`);
    expect(result).toEqual(PROCESS);
  });

  it('getGroups to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(GROUPS));
    const result = await getGroups(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/connections/${connection}/groups`);
    expect(result).toEqual(GROUPS);
  });

  it('getColumns to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(COLUMNS));
    const result = await getColumns(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/connections/${connection}/tasks/columns`);
    expect(result).toEqual(COLUMNS);
  });
});
