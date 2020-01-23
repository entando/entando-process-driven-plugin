import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import { DOMAINS } from 'api/constants';
import TaskCompletionFormContainer from 'components/TaskCompletionForm/TaskCompletionFormContainer';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import MOCKED_TASK from 'mocks/taskDetails/task';
import MOCKED_TASK_FORM from 'mocks/taskCompletionForm/formSchema';

describe('<TaskCompletionFormContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const taskId = 'test';
    const taskListUrl = `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}@${
      MOCKED_TASK.payload.id.split('@')[1]
    }`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.TASK_DETAILS))
      .once(JSON.stringify(MOCKED_TASK))
      .once(JSON.stringify(MOCKED_TASK_FORM));

    const { container } = render(<TaskCompletionFormContainer taskId={taskId} />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(3);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(taskListUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<TaskCompletionFormContainer taskId="1" />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
