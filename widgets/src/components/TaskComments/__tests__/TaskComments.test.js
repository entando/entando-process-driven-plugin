import { render, wait, screen } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import MOCKED_GET_TASK_COMMENTS_RESPONSE from 'mocks/taskComments/getComments';
import { getTaskComments } from 'api/pda/comments';
import { getPageWidget } from 'api/app-builder/pages';

import TaskComments from 'components/TaskComments/TaskComments';

jest.mock('api/app-builder/pages');
jest.mock('api/pda/comments');

beforeEach(() => {
  getPageWidget.mockClear();
  getTaskComments.mockClear();
});

describe('<TaskComments />', () => {
  getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_COMMENTS.configs));
  getTaskComments.mockImplementation(() =>
    Promise.resolve(MOCKED_GET_TASK_COMMENTS_RESPONSE.WITH_COMMENTS)
  );

  it('renders snapshot correctly', async () => {
    const { container } = render(
      <TaskComments
        taskId={WIDGET_CONFIGS.TASK_COMMENTS.taskId}
        pageCode={WIDGET_CONFIGS.TASK_COMMENTS.pageCode}
        frameId={WIDGET_CONFIGS.TASK_COMMENTS.frameId}
        widgetCode={WIDGET_CONFIGS.TASK_COMMENTS.widgetCode}
      />
    );

    await wait(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('renders no comments message when there are no comments', async () => {
    getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_COMMENTS.configs));
    getTaskComments.mockImplementation(() =>
      Promise.resolve(MOCKED_GET_TASK_COMMENTS_RESPONSE.NO_COMMENTS)
    );

    render(
      <TaskComments
        taskId={WIDGET_CONFIGS.TASK_COMMENTS.taskId}
        pageCode={WIDGET_CONFIGS.TASK_COMMENTS.pageCode}
        frameId={WIDGET_CONFIGS.TASK_COMMENTS.frameId}
        widgetCode={WIDGET_CONFIGS.TASK_COMMENTS.widgetCode}
      />
    );

    await wait(() => {
      expect(screen.getByText('taskComments.noComments')).toBeInTheDocument();
    });
  });
});
