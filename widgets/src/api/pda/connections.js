import { METHODS, DOMAINS } from 'api/constants';

import MOCK_CONNECTIONS from 'mocks/pda/connections';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
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
    uri: `/connections?ID=${name}`,
    method: METHODS.DELETE,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: true,
  });

export const saveConnection = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections`,
    method: METHODS.PUT,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: true,
    body: connection,
  });

export const createConnection = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections`,
    method: METHODS.POST,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: true,
    body: connection,
  });

export const testConnection = async name =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${name}/test`,
    method: METHODS.GET,
    mockResponse: MOCK_CONNECTIONS,
    useAuthentication: true,
  });
