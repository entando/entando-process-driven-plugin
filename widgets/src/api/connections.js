import { METHODS, DOMAINS } from 'api/constants';

import { CONNECTIONS } from 'mocks/taskList/configs';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getConnections = async () =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: '/connections',
    method: METHODS.GET,
    mockResponse: CONNECTIONS,
    useAuthentication: false,
  });
