import React from 'react';
import { render } from '@testing-library/react';
import TaskListSkeleton from 'components/TaskList/TaskListSkeleton';
import 'mocks/i18nMock';

describe('<TaskListSkeleton />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<TaskListSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
