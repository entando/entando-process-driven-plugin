import { METHODS, DOMAINS } from '../constants';
import getMockedTasks from '../../mocks/pda/taskList.api';

import makeRequest from '../makeRequest';

import COLUMNS from '../../mocks/pda/columns';
import MOCKED_GET_TASK_RESPONSE from '../../mocks/taskDetails/getTask';
import MOCKED_GET_TASK_FORM_RESPONSE from '../../mocks/taskCompletionForm/getFormSchema';
import MOCKED_POST_TASK_FORM_RESPONSE from '../../mocks/taskCompletionForm/postFormData';
import MOCKED_BULK_ACTION_RESPONSE from '../../mocks/pda/bulkActions';

export const getTasks = async (params = {}) => {
  const { connection, groups, page = 0, pageSize = 30, sortedColumn, sortOrder, filter } = params;
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks`,
    queryParams: {
      page: page + 1,
      pageSize,
      sort: sortedColumn,
      direction: sortOrder && sortOrder.toUpperCase(),
      filter,
      groups,
    },
    method: METHODS.GET,
    mockResponse: getMockedTasks(page, pageSize, sortedColumn, sortOrder, filter),
    useAuthentication: true,
  });
};

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
    useAuthentication: true,
    mockResponse: MOCKED_GET_TASK_FORM_RESPONSE.ALL_FIELDS,
  });
};

export const postTaskForm = async (connection, taskId, body) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/form`,
    method: METHODS.POST,
    body: JSON.stringify(body),
    mockResponse: MOCKED_POST_TASK_FORM_RESPONSE,
    useAuthentication: true,
  });

export const fetchSingleTask = async ({
  taskPosition, // task position relative to task list
  connection,
  groups,
  onError,
}) => {
  try {
    const { payload: tasks, metadata } = await getTasks({
      connection,
      groups,
      page: taskPosition,
      pageSize: 1,
    });

    if (!tasks) {
      throw new Error('messages.errors.errorResponse');
    }

    return { task: tasks[0], metadata };
  } catch (error) {
    onError(error.message);
  }
  return {};
};

export const TASK_BULK_ACTIONS = [
  'assign',
  'claim',
  'complete',
  'pause',
  'resume',
  'start',
  'unclaim',
];

export const putTasksBulkAction = async (connection, action, taskIds, assignee) => {
  const subUri = action === 'assign' && assignee ? `/${assignee}` : '';
  const uri = `/connections/${connection}/bulk/tasks/${action}${subUri}`;
  return makeRequest({
    domain: DOMAINS.PDA,
    uri,
    method: METHODS.PUT,
    body: JSON.stringify(taskIds),
    mockResponse: MOCKED_BULK_ACTION_RESPONSE,
    useAuthentication: true,
  });
};
