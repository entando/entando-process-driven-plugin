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
    useAuthentication: false,
  });
