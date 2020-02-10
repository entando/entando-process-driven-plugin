import makeRequest from 'api/makeRequest';
import { DOMAINS, METHODS } from 'api/constants';
import getMockSummary, { MOCK_SUMMARY_DATATYPES } from 'mocks/summary/summary';

export const getSummaryDataTypes = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/summaries/dataTypes`,
    method: METHODS.GET,
    mockResponse: MOCK_SUMMARY_DATATYPES,
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
    body: JSON.stringify({ ...defaultSummaryParams, ...payload }), // note: dataType is needed here
    mockResponse: getMockSummary(type),
    useAuthentication: true,
  });
