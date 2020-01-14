import { METHODS } from 'api/constants';
import makeRequest from 'api/makeRequest';

import mockTasks from 'mocks/taskList/tasks.json';

describe('makeRequest API', () => {
  it('makeRequest to return expected response', async () => {
    const connection = 'kieStaging';
    const uri = `/connections/${connection}/tasks?sort=taskId`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await makeRequest({ mockResponse: JSON.stringify(mockTasks), uri });

    expect(result).toEqual(mockTasks);
  });

  it('makeRequest with options', async () => {
    const connection = 'kieStaging';
    const uri = `/connections/${connection}/tasks?sort=taskId`;

    fetch.mockResponseOnce(JSON.stringify(mockTasks));
    const result = await makeRequest({
      mockResponse: JSON.stringify(mockTasks),
      uri,
      method: METHODS.PUT,
      body: { test: 'test' },
      useAuthentication: true,
    });

    expect(result).toEqual(mockTasks);
  });
});
