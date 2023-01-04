import { METHODS, DOMAINS } from '../constants';

import MOCK_CONNECTIONS, {
  TEST_CONNECTION,
  SAVE_CONNECTION,
  DELETE_CONNECTION,
} from '../../mocks/pda/connections';
import makeRequest from '../makeRequest';

export const getConnections = async () =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: '/connections',
    method: METHODS.GET,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: true,
  });

export const deleteConnection = async name =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${name}`,
    method: METHODS.DELETE,
    mockResponse: DELETE_CONNECTION,
    useAuthentication: true,
  });

export const saveConnection = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections`,
    method: METHODS.PUT,
    mockResponse: SAVE_CONNECTION,
    useAuthentication: true,
    body: JSON.stringify(connection),
  });

export const createConnection = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections`,
    method: METHODS.POST,
    mockResponse: SAVE_CONNECTION,
    useAuthentication: true,
    body: JSON.stringify(connection),
  });

export const testConnection = async name =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${name}/test`,
    method: METHODS.GET,
    mockResponse: TEST_CONNECTION,
    useAuthentication: true,
  });
