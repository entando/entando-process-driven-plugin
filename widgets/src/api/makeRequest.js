import { IS_MOCKED_API, MOCK_API_DELAY, DOMAIN } from 'api/constants';
import utils from 'utils';

export default async ({
  domain,
  uri,
  method,
  mockResponse,
  useAuthentication,
  body,
  headers = {},
}) => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return mockResponse;
  }

  const url = `${domain || DOMAIN}${uri}`;

  const requestHeaders = useAuthentication
    ? new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        ...headers,
      })
    : new Headers(headers);

  const configs = {
    method,
    ...(body ? { body } : {}),
    headers: requestHeaders,
  };

  const response = await fetch(url, configs);

  return response.json();
};
