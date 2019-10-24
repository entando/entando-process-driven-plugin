import React from 'react';
import { render } from '@testing-library/react';
import Loader from 'components/common/Loader';
import '@testing-library/jest-dom/extend-expect';
import 'mocks/i18nMock';

describe('<Loader />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<Loader />);

    expect(container).toMatchSnapshot();
  });
});
