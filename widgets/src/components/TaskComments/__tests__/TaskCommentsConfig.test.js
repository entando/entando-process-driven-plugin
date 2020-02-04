import { render, fireEvent, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';

import { getConnections } from 'api/pda/connections';
import { getProcesses } from 'api/pda/processes';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';
import mockKeycloak from 'mocks/auth/keycloak';

mockKeycloak();

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

    const { container } = render(
      <TaskCommentsConfig
        pageCode={WIDGET_CONFIGS.TASK_COMMENTS.pageCode}
        frameId={WIDGET_CONFIGS.TASK_COMMENTS.frameId}
        widgetCode={WIDGET_CONFIGS.TASK_COMMENTS.widgetCode}
      />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });

  it('calls putPageWidget after Save button is pressed', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));
    getProcesses.mockImplementation(() => Promise.resolve(PROCESSES));
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_COMMENTS.configs));
    putPageWidget.mockImplementation(() => {});

    const { findByText } = render(
      <TaskCommentsConfig
        pageCode={WIDGET_CONFIGS.TASK_COMMENTS.pageCode}
        frameId={WIDGET_CONFIGS.TASK_COMMENTS.frameId}
        widgetCode={WIDGET_CONFIGS.TASK_COMMENTS.widgetCode}
      />
    );

    const saveButton = await findByText('Save');
    fireEvent.click(saveButton);

    await wait(() => {
      expect(putPageWidget).toHaveBeenCalledTimes(1);
    });
  });
});
