import { IS_MOCKED_API, MOCK_API_DELAY, LOCAL, DOMAINS, METHODS } from 'api/constants';
import utils from 'utils';

export default async ({
  domain,
  uri,
  method,
  mockResponse,
  withAuthentication,
  body,
  queryParams,
  forceMock,
}) => {
  if (IS_MOCKED_API || forceMock) {
    await utils.timeout(MOCK_API_DELAY);
    return mockResponse;
  }

  let url = LOCAL ? `${DOMAINS.PDA}${uri}` : `${domain || ''}${uri}`;
  if (queryParams) {
    url += '?';
    url += Object.keys(queryParams)
      .filter(k => queryParams[k] !== undefined && queryParams[k] !== '')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
      .join('&');
  }

  const configs = {};
  configs.method = method || METHODS.GET;

  if (body) {
    configs.body = body;
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  if (withAuthentication) {
    const token = localStorage.getItem('token');
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, configs);

  return response.json();
};
