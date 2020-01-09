import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import TaskListContainer from 'components/TaskList/TaskListContainer';
import mockTasks from 'mocks/taskList/tasks.json';
import { WIDGET_CONFIGS } from 'mocks/taskList/configs';

describe('<TaskListContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `/api/pages//widgets/`;
    const connection = 'kieStaging';
    const taskListUrl = `/pda/connections/${connection}/tasks?page=1&pageSize=30&sort=taskId`;

    fetch.once(JSON.stringify(WIDGET_CONFIGS)).once(JSON.stringify(mockTasks));

    const { container } = render(<TaskListContainer />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(taskListUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<TaskListContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
