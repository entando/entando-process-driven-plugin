import { render, fireEvent, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import mockKeycloak from 'mocks/auth/keycloak';
import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';

import { getConnections } from 'api/pda/connections';
import { getProcesses } from 'api/pda/processes';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

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

describe('<TaskCompletionFormConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));
    getProcesses.mockImplementation(() => Promise.resolve(PROCESSES));
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.COMPLETION_FORM.configs));

    const { container } = render(
      <TaskCompletionFormConfig
        pageCode={WIDGET_CONFIGS.COMPLETION_FORM.pageCode}
        frameId={WIDGET_CONFIGS.COMPLETION_FORM.frameId}
        widgetCode={WIDGET_CONFIGS.COMPLETION_FORM.widgetCode}
      />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });

  it('calls putPageWidget after Save button is pressed', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));
    getProcesses.mockImplementation(() => Promise.resolve(PROCESSES));
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.COMPLETION_FORM.configs));
    putPageWidget.mockImplementation(() => {});

    const { findByText } = render(
      <TaskCompletionFormConfig
        pageCode={WIDGET_CONFIGS.COMPLETION_FORM.pageCode}
        frameId={WIDGET_CONFIGS.COMPLETION_FORM.frameId}
        widgetCode={WIDGET_CONFIGS.COMPLETION_FORM.widgetCode}
      />
    );

    const saveButton = await findByText('Save');
    fireEvent.click(saveButton);

    await wait(() => {
      expect(putPageWidget).toHaveBeenCalledTimes(1);
    });
  });
});
