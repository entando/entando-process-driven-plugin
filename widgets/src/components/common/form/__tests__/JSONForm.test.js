import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import JSONForm from 'components/common/form/JSONForm';

describe('<JSONForm />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<JSONForm />);

    expect(container).toMatchSnapshot();
  });
});
