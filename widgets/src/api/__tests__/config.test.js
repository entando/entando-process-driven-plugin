import configApi from 'api/config';

import mockConfig from 'mocks/config.json';

describe('Config API', () => {
  it('configApi.get to return expected data', async () => {
    const url = `/entando-de-app/api/pages/task_list/widgets/1`;
    fetch.mockResponseOnce(JSON.stringify(mockConfig));

    const result = await configApi.get('task_list', 1);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockConfig);
  });
});
