import React from 'react';
import { render } from '@testing-library/react';
import dateCell from 'components/common/Table/custom/DateCell';
import moment from 'moment';

describe('<DateCell />', () => {
  it('date should be formatted properly', () => {
    const DateCell = dateCell('date');
    const date = new Date();
    const { container } = render(<DateCell row={{ date }} />);

    expect(container.querySelector('span').textContent).toBe(moment(date).format('MM/DD/YYYY'));
  });
});
