import { IS_MOCKED_API, MOCK_API_DELAY, DOMAINS, METHODS, TOKENS } from 'api/constants';
import utils from 'utils';

const getParams = queryParams =>
  Object.keys(queryParams)
    .filter(k => queryParams[k] !== undefined && queryParams[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join('&');

export default async ({
  domain,
  uri,
  method,
  mockResponse = {},
  useAuthentication,
  body,
  headers = {},
  queryParams,
  forceMock,
}) => {
  if (IS_MOCKED_API || forceMock) {
    await utils.timeout(MOCK_API_DELAY);
    return mockResponse;
  }

  // TODO: CHECK DOMAIN VARIABLE
  const url = `${domain || DOMAINS.PDA}${uri}${queryParams ? `?${getParams(queryParams)}` : ''}`;

  const requestHeaders = useAuthentication
    ? new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || TOKENS.APP_BUILDER}`,
        ...headers,
      })
    : new Headers(headers);

  const configs = {
    method: method || METHODS.GET,
    ...(body ? { body } : {}),
    headers: requestHeaders,
  };

  const response = await fetch(url, configs);
  if (!response.ok) {
    throw new Error(`Bad Response from server: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
