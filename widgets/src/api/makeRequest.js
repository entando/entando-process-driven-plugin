import { IS_MOCKED_API, MOCK_API_DELAY, DOMAINS, METHODS } from 'api/constants';
import utils from 'utils';

const getKeycloakToken = () => {
  if (
    window &&
    window.entando &&
    window.entando.keycloak &&
    window.entando.keycloak.authenticated
  ) {
    return window.entando.keycloak.token;
  }
  return '';
};

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
  authMethod = '',
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

  const keycloakToken = getKeycloakToken();
  const token = authMethod === 'entando-api' ? localStorage.getItem('token') : keycloakToken;

  const requestHeaders = useAuthentication
    ? new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
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

  const responseHeaders = response.headers.get('Content-Type');

  return responseHeaders && responseHeaders.includes('xml') ? response.text() : response.json();
};
