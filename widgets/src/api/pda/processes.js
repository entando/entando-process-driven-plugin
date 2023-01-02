import { METHODS, DOMAINS } from '../constants';

import MOCK_PROCESSES from '../../mocks/pda/processes';
import MOCK_PROCESSES_LIST from '../../mocks/pda/processList';
import MOCKED_PROCESS_FORM from '../../mocks/process-form/formSchema';
import { postResponse as MOCK_FORM_SUBMIT_RESPONSE } from '../../mocks/process-form/formData';
import MOCK_DIAGRAM from '../../mocks/pda/diagram.svg';
import makeRequest from '../makeRequest';

export const getProcesses = async (connection, processDefinitionId) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/instances`,
    queryParams: {
      processDefinitionId,
    },
    method: METHODS.GET,
    mockResponse: MOCK_PROCESSES_LIST,
    useAuthentication: true,
  });

export const getProcessDefinitions = async connection =>
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

export const getProcessForm = async (connection, processId) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions/${processId}/form`,
    method: METHODS.GET,
    mockResponse: MOCKED_PROCESS_FORM,
    useAuthentication: true,
  });

export const postProcessForm = async (connection, processId, body) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/processes/definitions/${processId}/form`,
    method: METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    mockResponse: MOCK_FORM_SUBMIT_RESPONSE,
    useAuthentication: true,
  });
