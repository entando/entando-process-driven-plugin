import { DOMAIN, WIDGET_CODES } from 'api/constants';
import configApi from 'api/config';

import mockConfig from 'mocks/config.json';

describe('Config API', () => {
  it('configApi.get to return expected data', async () => {
    const url = `${DOMAIN}/configs/${WIDGET_CODES.taskList}`;
    fetch.mockResponseOnce(JSON.stringify(mockConfig));

    const result = await configApi.get(WIDGET_CODES.taskList);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(mockConfig);
  });
});
