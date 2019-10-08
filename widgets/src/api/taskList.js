import { DOMAIN, IS_MOCKED_API, MOCK_API_DELAY } from 'api/constants';
import tasks from 'mocks/taskList/tasks';
import utils from 'utils';

const get = async connection => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return tasks;
  }

  const url = `${DOMAIN}/connections/${connection}/tasks`;
  const response = await fetch(url);

  return response.json();
};

export default {
  get,
};
