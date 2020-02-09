import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import TaskCommentsSkeleton from 'components/TaskComments/TaskCommentsSkeleton';

describe('<TaskCommentsSkeleton />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<TaskCommentsSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
