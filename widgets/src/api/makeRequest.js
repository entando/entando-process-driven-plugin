import { IS_MOCKED_API, MOCK_API_DELAY, DOMAINS, METHODS } from 'api/constants';
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

  const url = `${domain || DOMAINS.PDA}${uri}${queryParams ? `?${getParams(queryParams)}` : ''}`;

  const requestHeaders = useAuthentication
    ? new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    const payload = await response.json();
    throw new Error(
      payload.message
        ? payload.message
        : `Bad Response from server: ${response.status} ${response.statusText}`
    );
  }

  const responseHeaders = response.headers.get('Content-Type');

  if (responseHeaders && responseHeaders.includes('xml')) {
    return response.text();
  }
  if (responseHeaders && responseHeaders.includes('octet')) {
    return response;
  }
  return response.json();
};
