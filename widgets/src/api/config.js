import { MOCK_API_DELAY, IS_MOCKED_API } from 'api/constants';
import utils from 'utils';
import config from 'mocks/config';

const get = async (pageCode, frameId) => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return config;
  }

  const url = `/entando-de-app/api/pages/${pageCode}/widgets/${frameId}`;
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'get',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
  });

  return response.json();
};

export default {
  get,
};
