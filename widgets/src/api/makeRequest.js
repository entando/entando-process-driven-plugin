import { IS_MOCKED_API, MOCK_API_DELAY, DOMAIN } from 'api/constants';
import utils from 'utils';

export default async ({ domain, uri, method, mockResponse, withAuthentication, body }) => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return mockResponse;
  }

  const url = `${domain || DOMAIN}${uri}`;
  const configs = {};
  configs.method = method;

  if (body) {
    configs.body = body;
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (withAuthentication) {
    const token = localStorage.getItem('token');
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, configs);

  return response.json();
};
