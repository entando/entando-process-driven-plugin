import { METHODS, DOMAINS } from 'api/constants';
import getMockedTasks from 'mocks/taskList/api.mock';

import { PROCESS, GROUPS, COLUMNS } from 'mocks/taskList/configs';
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

export const getProcess = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: PROCESS,
    useAuthentication: true,
  });

export const getGroups = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/groups`,
    method: METHODS.GET,
    mockResponse: GROUPS,
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
