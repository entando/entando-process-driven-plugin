import { METHODS, DOMAINS } from 'api/constants';
import getMockedTasks from 'mocks/pda/taskList.api';

import makeRequest from 'api/makeRequest';

import COLUMNS from 'mocks/pda/columns';
import MOCKED_GET_TASK_RESPONSE from 'mocks/taskDetails/getTask';
import MOCKED_GET_TASK_FORM_RESPONSE from 'mocks/taskCompletionForm/getFormSchema';
import MOCKED_POST_TASK_FORM_RESPONSE from 'mocks/taskCompletionForm/postFormData';

export const getTasks = async (
  connection,
  page = 0,
  pageSize = 30,
  sortedColumn,
  sortOrder,
  filter
) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks`,
    queryParams: {
      page: page + 1,
      pageSize,
      sort: sortedColumn,
      direction: sortOrder,
      filter,
    },
    method: METHODS.GET,
    mockResponse: getMockedTasks(page, pageSize, sortedColumn, sortOrder, filter),
    useAuthentication: true,
  });

export const getColumns = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/columns`,
    method: METHODS.GET,
    mockResponse: COLUMNS,
    useAuthentication: true,
  });

export const getTask = async (connection, taskId) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}`,
    method: METHODS.GET,
    mockResponse: MOCKED_GET_TASK_RESPONSE,
    useAuthentication: true,
  });
};

export const getTaskForm = async (connection, taskId) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/form`,
    method: METHODS.GET,
    mockResponse: MOCKED_GET_TASK_FORM_RESPONSE,
    useAuthentication: true,
  });
};

export const postTaskForm = async (connection, taskId, formData) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/form`,
    method: METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    mockResponse: MOCKED_POST_TASK_FORM_RESPONSE,
    useAuthentication: true,
  });
};
