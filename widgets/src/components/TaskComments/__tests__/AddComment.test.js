import { render, fireEvent, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import AddComment from 'components/TaskComments/AddComment';

describe('<AddComment />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<AddComment />);

    expect(container).toMatchSnapshot();
  });

  it('does not call onClickAddComment on render', async () => {
    const onClickAddComment = jest.fn();
    render(<AddComment onClickAddComment={onClickAddComment} />);

    await wait(() => {
      expect(onClickAddComment).toHaveBeenCalledTimes(0);
    });
  });

  it('calls onClickAddComment when "Add" button is clicked', async () => {
    const onClickAddComment = jest.fn();
    const { findByLabelText, findByText } = render(
      <AddComment onClickAddComment={onClickAddComment} />
    );

    const nameField = await findByLabelText('taskComments.addNote');
    fireEvent.change(nameField, { target: { value: 'Comment text.' } });

    const addButton = await findByText('common.add');
    fireEvent.click(addButton);

    await wait(() => {
      expect(onClickAddComment).toHaveBeenCalledTimes(1);
      expect(nameField).toBeEmpty();
    });
  });

  it('does not call onClickAddComment when "Add" button is clicked without comment added', async () => {
    const onClickAddComment = jest.fn();
    const { findByText } = render(<AddComment onClickAddComment={onClickAddComment} />);

    const addButton = await findByText('common.add');
    fireEvent.click(addButton);

    await wait(() => {
      expect(onClickAddComment).toHaveBeenCalledTimes(0);
    });
  });

  it('does not show Add when loading', async () => {
    const { queryByText, container } = render(<AddComment loading />);

    await wait(() => {
      expect(container.querySelector('svg')).toHaveClass('MuiCircularProgress-svg');
      expect(queryByText('common.add')).not.toBeInTheDocument();
    });
  });
});
