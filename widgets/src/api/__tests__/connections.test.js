import { getConnections } from 'api/pda/connections';
import { DOMAINS } from 'api/constants';
import CONNECTIONS from 'mocks/pda/connections';

describe('Connections API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getConnections to return expected data', async () => {
    fetch.mockResponseOnce(JSON.stringify(CONNECTIONS));
    const result = await getConnections();

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${DOMAINS.PDA}/connections`);
    expect(result).toEqual(CONNECTIONS);
  });
});
