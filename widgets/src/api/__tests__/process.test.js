import {
  getProcessDefinitions,
  getDiagram,
  getProcessForm,
  postProcessForm,
} from 'api/pda/processes';
import { DOMAINS } from 'api/constants';
import PROCESS from 'mocks/pda/connections';
import MOCKED_PROCESS_FORM from 'mocks/process-form/formSchema';
import { postResponse as MOCK_FORM_SUBMIT_RESPONSE } from 'mocks/process-form/formData';
import MOCK_DIAGRAM from 'mocks/pda/diagram.svg';

const connection = 'kieStaging';
const processId = '123@evaluation';

describe('Process API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getProcessDefinitions to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(PROCESS));
    const result = await getProcessDefinitions(connection);
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/definitions`
    );
    expect(result).toEqual(PROCESS);
  });

  it('getDiagram to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(MOCK_DIAGRAM));
    const result = await getDiagram(connection, processId);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/${processId}/diagram`
    );
    expect(result).toEqual(MOCK_DIAGRAM);
  });

  it('getProcessForm to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(MOCKED_PROCESS_FORM));
    const result = await getProcessForm(connection, processId);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/definitions/${processId}/form`
    );
    expect(result).toEqual(MOCKED_PROCESS_FORM);
  });

  it('postProcessForm to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(MOCK_FORM_SUBMIT_RESPONSE));
    const result = await postProcessForm(connection, processId, { a: { b: 1, c: 2 } });

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/definitions/${processId}/form`
    );
    expect(result).toEqual(MOCK_FORM_SUBMIT_RESPONSE);
  });
});
