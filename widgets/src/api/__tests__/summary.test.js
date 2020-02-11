import { getSummaryRepositories, getSummaryByType } from 'api/pda/summary';
import { DOMAINS } from 'api/constants';
import { MOCK_SUMMARY_TYPES, MOCK_SUMMARY_CARD } from 'mocks/summary/summary';

describe('Summary API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getSummaryRepositories to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(MOCK_SUMMARY_TYPES));
    const result = await getSummaryRepositories(connection);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/summaries/repositories`
    );
    expect(result).toEqual(MOCK_SUMMARY_TYPES);
  });

  it('getSummaryByType with Card to return expected data', async () => {
    const connection = 'kieStaging';
    fetch.mockResponseOnce(JSON.stringify(MOCK_SUMMARY_CARD));
    const result = await getSummaryByType(connection, 'Card', {
      frequency: 'monthly',
      dataType: 'request',
    });

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/summaries/summaryTypes/Card`
    );
    expect(result).toEqual(MOCK_SUMMARY_CARD);
  });
});
