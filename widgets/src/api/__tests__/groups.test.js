import { getGroups } from 'api/pda/groups';
import { DOMAINS } from 'api/constants';
import GROUPS from 'mocks/pda/groups';

describe('Process API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getGroups to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(GROUPS));
    const result = await getGroups(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${DOMAINS.PDA}/connections/${connection}/groups`);
    expect(result).toEqual(GROUPS);
  });
});
