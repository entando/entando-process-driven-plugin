import React from 'react';
import { render } from '@testing-library/react';
import SummaryCardValues from 'components/SummaryCard/SummaryCardValues';
import 'mocks/i18nMock';

describe('<SummaryCardValues />', () => {
  it('renders snapshot correctly', () => {
    const values = {
      value: 2123,
      percentage: 0.9243234,
    };
    const { container } = render(<SummaryCardValues dataType="requests" values={values} />);

    expect(container).toMatchSnapshot();
  });
});
