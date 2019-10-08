import { DOMAIN, IS_MOCKED_API, MOCK_API_DELAY } from 'api/constants';
import utils from 'utils';
import config from 'mocks/config';

const get = async widgetCode => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return config;
  }

  const url = `${DOMAIN}/configs/${widgetCode}`;
  const response = await fetch(url);

  return response.json();
};

export default {
  get,
};
