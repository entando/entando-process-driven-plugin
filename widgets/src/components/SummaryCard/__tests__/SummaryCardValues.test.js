import React from 'react';
import { render } from '@testing-library/react';
import SummaryCardValues from 'components/SummaryCard/SummaryCardValues';
import 'mocks/i18nMock';

describe('<SummaryCardValues />', () => {
  it('renders snapshot correctly', () => {
    const values = {
      title: 'REQUESTS.TITLE',
      totalLabel: 'REQUESTS.TOTAL_LABEL',
      total: '2123',
      percentage: '0.9243234',
    };
    const { container } = render(<SummaryCardValues values={values} />);

    expect(container).toMatchSnapshot();
  });
});
