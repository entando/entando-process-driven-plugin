import { DOMAIN, IS_MOCKED_API, MOCK_API_DELAY } from 'api/constants';
import getTasks from 'mocks/taskList/api.mock';
import utils from 'utils';

const get = async (connection, page, pageSize, sortedColumn, sortOrder) => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return getTasks(page, pageSize, sortedColumn, sortOrder);
  }

  const url = `${DOMAIN}/connections/${connection}/tasks`;
  const response = await fetch(url);

  return response.json();
};

export default {
  get,
};
