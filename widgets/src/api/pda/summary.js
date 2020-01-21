import makeRequest from 'api/makeRequest';
import { DOMAINS, METHODS } from 'api/constants';
import MOCK_SUMMARIES from 'mocks/summary/summaries';
import mockedSummary from 'mocks/summary/summary';

export const getSummaries = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries`,
    method: METHODS.GET,
    mockResponse: MOCK_SUMMARIES,
    useAuthentication: false,
  });

export const getSummary = async (connection, summaryId, frequency = 'monthly') =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries/${summaryId}?frequency=${frequency}`,
    method: METHODS.GET,
    mockResponse: mockedSummary,
    useAuthentication: false,
  });
