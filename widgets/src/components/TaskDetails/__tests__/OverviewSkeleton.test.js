import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import OverviewSkeleton from 'components/TaskDetails/Overview/OverviewSkeleton';

describe('<OverviewSkeleton />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<OverviewSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
