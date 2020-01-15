import { SERVICE, METHODS } from 'api/constants';
import mockedTask from 'mocks/taskDetails/task';
import mockedTaskForm from 'mocks/taskCompletionForm/formSchema';

import makeRequest from 'api/makeRequest';

export const getTask = async (connection, taskId) => {
  return makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/tasks/${taskId}`,
    method: METHODS.GET,
    mockResponse: mockedTask,
    useAuthentication: false,
  });
};

export const getTaskForm = async (connection, taskId) => {
  return makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/tasks/${taskId}/form`,
    method: METHODS.GET,
    mockResponse: mockedTaskForm,
    useAuthentication: false,
  });
};
