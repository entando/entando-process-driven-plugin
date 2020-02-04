import makeRequest from 'api/makeRequest';
import { DOMAINS, METHODS } from 'api/constants';
import MOCK_SUMMARIES from 'mocks/summary/summaries';
import MOCK_SUMMARY from 'mocks/summary/summary';

export const getSummaries = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries`,
    method: METHODS.GET,
    mockResponse: MOCK_SUMMARIES,
    useAuthentication: true,
  });

export const getSummary = async (connection, summaryId, frequency = 'monthly') =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries/${summaryId}`,
    method: METHODS.GET,
    queryParams: { frequency },
    mockResponse: MOCK_SUMMARY,
    useAuthentication: true,
  });
