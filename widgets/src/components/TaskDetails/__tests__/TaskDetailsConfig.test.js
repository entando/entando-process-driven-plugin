import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import TaskDetailsConfig from 'components/TaskDetails/TaskDetailsConfig';

import { getConnections } from 'api/pda/connections';
import { getProcesses } from 'api/pda/processes';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

jest.mock('api/app-builder/pages');
jest.mock('api/pda/connections');
jest.mock('api/pda/processes');

beforeEach(() => {
  getConnections.mockClear();
  getProcesses.mockClear();
  getPageWidget.mockClear();
  putPageWidget.mockClear();
});

describe('<TaskDetailsConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));
    getProcesses.mockImplementation(() => Promise.resolve(PROCESSES));
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_DETAILS.configs));

    const { container } = render(<TaskDetailsConfig config={{}} />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
