import { SERVICE, METHODS } from 'api/constants';
import mockedTask from 'mocks/taskDetails/task';

import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getTask = async (connection, taskId) => {
  return makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/tasks/${taskId}`,
    method: METHODS.GET,
    mockResponse: mockedTask,
    useAuthentication: false,
  });
};
