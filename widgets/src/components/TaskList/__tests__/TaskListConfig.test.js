import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import mockKeycloak from 'mocks/auth/keycloak';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import TaskListConfig from 'components/TaskList/TaskListConfig';

mockKeycloak();

describe('<TaskListConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(WIDGET_CONFIGS.TASK_LIST))
      .once(JSON.stringify(PROCESSES));

    const { container } = render(
      <TaskListConfig pageCode="1" frameId="2" widgetCode="pda_task_list" />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
