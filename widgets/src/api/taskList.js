import { IS_MOCKED_API, MOCK_API_DELAY, SERVICE } from 'api/constants';
import getTasks from 'mocks/taskList/api.mock';
import utils from 'utils';

const get = async (connection, page, pageSize, sortedColumn, sortOrder, filter) => {
  if (IS_MOCKED_API) {
    await utils.timeout(MOCK_API_DELAY);
    return getTasks(page, pageSize, sortedColumn, sortOrder, filter);
  }

  const url = `${SERVICE.URL}/connections/${connection}/tasks?sort=taskId`;
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
