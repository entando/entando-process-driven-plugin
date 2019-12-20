import { getTasks } from 'api/taskList';

import mockTasks from 'mocks/taskList/tasks.json';

describe('TaskList API', () => {
  it('getTasks to return expected data', async () => {
    const connection = 'kieStaging';
    const url = `/connections/${connection}/tasks?sort=taskId`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await getTasks(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockTasks);
  });
});
