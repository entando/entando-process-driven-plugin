import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import JSONFormSkeleton from 'components/common/form/JSONFormSkeleton';

describe('<JSONFormSkeleton />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<JSONFormSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
