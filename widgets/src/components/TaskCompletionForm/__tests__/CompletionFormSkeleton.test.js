import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CompletionFormSkeleton from 'components/TaskCompletionForm/CompletionFormSkeleton';

describe('<CompletionFormSkeleton />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<CompletionFormSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
