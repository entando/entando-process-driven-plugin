import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import { taskListConfigs as WIDGET_CONFIGS } from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESS from 'mocks/pda/process';
import TaskListConfig from 'components/TaskList/TaskListConfig';

describe('<TaskListConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(WIDGET_CONFIGS))
      .once(JSON.stringify(PROCESS));

    const { container } = render(
      <TaskListConfig pageCode="1" frameId="2" widgetCode="pda_task_list" />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
