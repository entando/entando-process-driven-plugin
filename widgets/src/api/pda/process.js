import { METHODS, DOMAINS } from 'api/constants';

import PROCESS from 'mocks/pda/process';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getProcess = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: PROCESS,
    useAuthentication: true,
  });
