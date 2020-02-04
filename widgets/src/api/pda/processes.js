import { METHODS, DOMAINS } from 'api/constants';

import MOCK_PROCESSES from 'mocks/pda/processes';
import MOCK_DIAGRAM from 'mocks/pda/diagram.svg';
import makeRequest from 'api/makeRequest';

export const getProcesses = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions`,
    method: METHODS.GET,
    mockResponse: MOCK_PROCESSES,
    useAuthentication: true,
  });

export const getDiagram = async (connection, processId) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/${processId}/diagram`,
    method: METHODS.GET,
    mockResponse: MOCK_DIAGRAM,
    useAuthentication: true,
  });
