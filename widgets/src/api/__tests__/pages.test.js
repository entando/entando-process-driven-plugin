import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

import { WIDGET_CONFIGS } from 'mocks/taskList/configs';

describe('TaskList API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getPageWidget to return expected data', async () => {
    const pageCode = 0;
    const frameId = 1;
    const url = `/api/pages/${pageCode}/widgets/${frameId}`;

    fetch.mockResponseOnce(JSON.stringify(WIDGET_CONFIGS));
    const result = await getPageWidget(pageCode, frameId);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(WIDGET_CONFIGS);
  });

  it('putPageWidget to return expected data', async () => {
    const pageCode = 0;
    const frameId = 1;
    const url = `/api/pages/${pageCode}/widgets/${frameId}`;
    fetch.mockResponseOnce(JSON.stringify({}));

    const result = await putPageWidget(pageCode, frameId, {});

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual({});
  });
});
