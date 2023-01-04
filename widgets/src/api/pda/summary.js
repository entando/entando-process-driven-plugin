import makeRequest from '../makeRequest';
import { DOMAINS, METHODS } from '../constants';
import getMockSummary, { MOCK_SUMMARY_TYPES } from '../../mocks/summary/summary';

export const getSummaryRepositories = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries/repositories`,
    method: METHODS.GET,
    mockResponse: MOCK_SUMMARY_TYPES,
    useAuthentication: true,
  });

export const defaultSummaryParams = {
  frequency: 'DAILY',
};

export const getSummaryByType = async (connection, type, payload) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries/summaryTypes/${type}`,
    method: METHODS.POST,
    body: JSON.stringify({ ...defaultSummaryParams, ...payload }), // note: type is needed here
    mockResponse: getMockSummary(type),
    useAuthentication: true,
  });
