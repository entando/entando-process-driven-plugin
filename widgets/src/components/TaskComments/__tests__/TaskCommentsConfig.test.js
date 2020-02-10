import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';

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

describe('<TaskCommentsConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));
    getProcesses.mockImplementation(() => Promise.resolve(PROCESSES));
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_COMMENTS.configs));

    const { container } = render(<TaskCommentsConfig config={{}} />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
