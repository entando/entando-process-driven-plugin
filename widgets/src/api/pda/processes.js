import { METHODS, DOMAINS } from 'api/constants';

import MOCK_PROCESSES from 'mocks/pda/processes';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getProcesses = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: MOCK_PROCESSES,
    useAuthentication: true,
  });
