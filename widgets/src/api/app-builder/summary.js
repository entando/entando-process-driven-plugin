import { SERVICE, METHODS } from 'api/constants';
import mockedSummary from 'mocks/summaries/summary';

import makeRequest from 'api/makeRequest';

export const getSummary = async (connection, summaryId, params = '?frequency=monthly') => {
  return makeRequest({
    domain: SERVICE.URL,
    uri: `/connections/${connection}/summaries/${summaryId}${params}`,
    method: METHODS.GET,
    mockResponse: mockedSummary,
    useAuthentication: false,
  });
};
