import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import TableSortLabel from 'components/common/Table/TableSortLabel';

describe('<TableSortLabel />', () => {
  it('renders snapshot correctly', () => {
    const onClick = jest.fn();
    const { container } = render(
      <TableSortLabel onClick={onClick} active={false}>
        Test
      </TableSortLabel>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly with desc direction and active', () => {
    const onClick = jest.fn();
    const { container, getByText } = render(
      <TableSortLabel onClick={onClick} direction="desc" active>
        Test
      </TableSortLabel>
    );

    fireEvent.click(getByText('Test'));

    expect(container).toMatchSnapshot();
    expect(onClick).toHaveBeenCalled();
  });
});
