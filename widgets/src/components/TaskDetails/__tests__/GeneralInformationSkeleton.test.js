import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import GeneralInformationSkeleton from 'components/TaskDetails/GeneralInformation/GeneralInformationSkeleton';

describe('<GeneralInformationSkeleton />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<GeneralInformationSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
