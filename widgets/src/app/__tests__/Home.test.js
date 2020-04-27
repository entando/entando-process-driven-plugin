import { render } from '@testing-library/react';
import React from 'react';

import 'mocks/i18nMock';

import Home from 'app/Home';

describe('<Home />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<Home />);

    expect(container).toMatchSnapshot();
  });
});
