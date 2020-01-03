import { SERVICE, METHODS } from 'api/constants';
import mockedTask from 'mocks/taskDetails/task';

import { CONNECTIONS, PROCESS, GROUPS, COLUMNS } from 'mocks/taskList/configs';
import makeRequest from 'api/makeRequest';

export const getTask = async (connection, taskId) => {
  return makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/tasks/${taskId}`,
    method: METHODS.GET,
    mockResponse: mockedTask,
    useAuthentication: true,
  });
};

// Configs

export const getConnections = async () =>
  makeRequest({
    domain: SERVICE.URL,
    uri: '/connections',
    method: METHODS.GET,
    mockResponse: CONNECTIONS,
    useAuthentication: false,
  });

export const getProcess = async connection =>
  makeRequest({
    // domain: PDA_DOMAIN,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: PROCESS,
    useAuthentication: true,
  });

export const getGroups = async connection =>
  makeRequest({
    // domain: PDA_DOMAIN,
    uri: `/connections/${connection}/groups`,
    method: METHODS.GET,
    mockResponse: GROUPS,
    useAuthentication: true,
  });

export const getColumns = async connection =>
  makeRequest({
    // domain: PDA_DOMAIN,
    uri: `/connections/${connection}/tasks/columns`,
    method: METHODS.GET,
    mockResponse: COLUMNS,
    useAuthentication: true,
  });
