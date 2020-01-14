import makeRequest from 'api/makeRequest';
import { SERVICE, METHODS } from 'api/constants';

import MOCK_CONNECTIONS from 'mocks/pda/connections';
import MOCK_PROCESSES from 'mocks/pda/processes';

export const getConnections = async () =>
  makeRequest({
    domain: SERVICE.URL,
    uri: '/connections',
    method: METHODS.GET,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: false,
  });

export const getProcess = async connection =>
  makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: MOCK_PROCESSES,
    useAuthentication: false,
  });
