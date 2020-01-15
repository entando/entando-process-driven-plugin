import { getProcess } from 'api/pda/process';
import { DOMAINS } from 'api/constants';
import PROCESS from 'mocks/pda/connections';

describe('Process API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getProcess to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(PROCESS));
    const result = await getProcess(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/processes/definitions`
    );
    expect(result).toEqual(PROCESS);
  });
});
