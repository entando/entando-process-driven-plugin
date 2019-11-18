import { MOCK_API_DELAY } from 'api/constants';
import utils from 'utils';
import config from 'mocks/config';

const get = async () => {
  await utils.timeout(MOCK_API_DELAY);
  return config;
};

export default {
  get,
};
