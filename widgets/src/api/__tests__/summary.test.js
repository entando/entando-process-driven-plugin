import { getSummaries, getSummary } from 'api/pda/summary';
import { DOMAINS } from 'api/constants';
import MOCK_SUMMARIES from 'mocks/summary/summaries';
import MOCK_SUMMARY from 'mocks/summary/summary';

describe('Summary API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getSummaries to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(MOCK_SUMMARIES));
    const result = await getSummaries(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${DOMAINS.PDA}/connections/${connection}/summaries`);
    expect(result).toEqual(MOCK_SUMMARIES);
  });

  it('getSummary to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(MOCK_SUMMARY));
    const result = await getSummary(connection, 'request');

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/summaries/request?frequency=monthly`
    );
    expect(result).toEqual(MOCK_SUMMARY);
  });
});
