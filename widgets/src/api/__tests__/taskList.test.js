import { SERVICE } from 'api/constants';
import taskListApi from 'api/taskList';

import mockTasks from 'mocks/taskList/tasks.json';

describe('TaskList API', () => {
  it('taskListApi.get to return expected data', async () => {
    const connection = 'kieStaging';
    const url = `${SERVICE.URL}/connections/${connection}/tasks?sort=taskId`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await taskListApi.get(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockTasks);
  });
});
