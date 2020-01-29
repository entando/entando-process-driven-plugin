import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/widgets';
import MOCKED_GET_TASK_COMMENTS_RESPONSE from 'mocks/taskComments/getComments';
import { getTaskComments } from 'api/pda/comments';
import { getPageWidget } from 'api/app-builder/pages';

import TaskCommentsContainer from 'components/TaskComments/TaskCommentsContainer';

jest.mock('api/app-builder/pages');
jest.mock('api/pda/comments');

beforeEach(() => {
  getPageWidget.mockClear();
  getTaskComments.mockClear();
});

describe('<TaskCommentsContainer />', () => {
  getPageWidget.mockImplementation(() => Promise.resolve(WIDGET_CONFIGS.TASK_COMMENTS.configs));
  getTaskComments.mockImplementation(() => Promise.resolve(MOCKED_GET_TASK_COMMENTS_RESPONSE));

  it('renders snapshot correctly', async () => {
    const { container } = render(
      <TaskCommentsContainer
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
});
