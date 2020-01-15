import { METHODS, DOMAINS } from 'api/constants';
import getMockedTasks from 'mocks/pda/taskList.api';

import COLUMNS from 'mocks/pda/columns';
import makeRequest from 'api/makeRequest';

export const getTasks = async (connection, page, pageSize, sortedColumn, sortOrder, filter) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks`,
    queryParams: {
      page: page || 1,
      pageSize: pageSize || 30,
      sort: sortedColumn,
      direction: sortOrder,
      filter,
    },
    method: METHODS.GET,
    mockResponse: getMockedTasks(page, pageSize, sortedColumn, sortOrder, filter),
    useAuthentication: true,
  });

// Configs

export const getColumns = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/columns`,
    method: METHODS.GET,
    mockResponse: COLUMNS,
    useAuthentication: true,
  });
