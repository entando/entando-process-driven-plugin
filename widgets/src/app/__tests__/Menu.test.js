import { render } from '@testing-library/react';
import React from 'react';

import 'mocks/i18nMock';

import Menu from 'app/Menu';

describe('<Menu />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<Menu />);

    expect(container).toMatchSnapshot();
  });
});
