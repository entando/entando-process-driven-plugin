import { IS_MOCKED_API, MOCK_API_DELAY, METHODS, TOKENS } from 'api/constants';
import utils from 'utils';

export default async ({
  domain,
  uri,
  method,
  mockResponse,
  useAuthentication,
  body,
  queryParams,
  forceMock,
}) => {
  if (IS_MOCKED_API || forceMock) {
    await utils.timeout(MOCK_API_DELAY);
    return mockResponse;
  }

  let url = `${domain || ''}${uri}`;
  if (queryParams) {
    url += '?';
    url += Object.keys(queryParams)
      .filter(k => queryParams[k] !== undefined && queryParams[k] !== '')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
      .join('&');
  }

  const configs = {
    method: method || METHODS.GET,
  };

  if (body) {
    configs.body = body;
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (useAuthentication) {
    const token = localStorage.getItem('token') || TOKENS.APP_BUILDER;
    headers.append('Authorization', `Bearer ${token}`);
  }
  configs.headers = headers;

  const response = await fetch(url, configs);
  if (!response.ok) {
    throw new Error(`Bad Response from server: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
