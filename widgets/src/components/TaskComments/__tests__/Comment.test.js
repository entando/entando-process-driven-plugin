import { render, fireEvent, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import Comment from 'components/TaskComments/Comment';

import MOCKED_GET_TASK_COMMENTS_RESPONSE from 'mocks/taskComments/getComments';

describe('<Comment />', () => {
  const MOCKED_COMMENT = MOCKED_GET_TASK_COMMENTS_RESPONSE.payload[0];

  const fixedDate = new Date(2020, 0, 1);
  global.Date = jest.fn(() => fixedDate);
  global.Date.now = jest.fn(() => fixedDate);

  it('renders snapshot correctly', async () => {
    const { container } = render(<Comment comment={MOCKED_COMMENT} />);

    expect(container).toMatchSnapshot();
  });

  it('shows Yes/No prompt when "Remove" is pressed', async () => {
    const { findByText, queryByText } = render(<Comment comment={MOCKED_COMMENT} />);

    const removeButton = await findByText('taskComments.remove');
    fireEvent.click(removeButton);

    await wait(() => {
      expect(queryByText('common.yes')).toBeInTheDocument();
      expect(queryByText('common.no')).toBeInTheDocument();
    });
  });

  it('hides prompt when No is pressed', async () => {
    const { findByText, queryByText } = render(<Comment comment={MOCKED_COMMENT} />);

    const removeButton = await findByText('taskComments.remove');
    fireEvent.click(removeButton);

    const noButton = await findByText('common.no');
    fireEvent.click(noButton);

    await wait(() => {
      expect(queryByText('common.yes')).not.toBeInTheDocument();
      expect(queryByText('common.no')).not.toBeInTheDocument();
    });
  });

  it('calls onClickRemoveComment function when Remove -> Yes is pressed', async () => {
    const onClickRemoveComment = jest.fn();
    const { findByText } = render(
      <Comment comment={MOCKED_COMMENT} onClickRemoveComment={onClickRemoveComment} />
    );

    const removeButton = await findByText('taskComments.remove');
    fireEvent.click(removeButton);

    const yesButton = await findByText('common.yes');
    fireEvent.click(yesButton);

    await wait(() => {
      expect(onClickRemoveComment).toHaveBeenCalledTimes(1);
    });
  });
});
