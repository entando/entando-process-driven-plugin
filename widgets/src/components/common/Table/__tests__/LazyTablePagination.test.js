import React from 'react';
import { cleanup, render } from '@testing-library/react';

import LazyTablePagination from 'components/common/Table/LazyTablePagination';

const rowsPerPageOptions = [5, 10, 15];

// eslint-disable-next-line react/prop-types
const TableHolder = ({ children }) => (
  <table>
    <tbody>
      <tr>{children}</tr>
    </tbody>
  </table>
);

describe('<LazyTablePagination />', () => {
  afterEach(cleanup);

  it('renders snapshot correctly', () => {
    const { container } = render(
      <TableHolder>
        <LazyTablePagination
          page={0}
          rowsPerPage={5}
          onChangePage={jest.fn()}
          onChangeRowsPerPage={jest.fn()}
          rowsPerPageOptions={rowsPerPageOptions}
          lastPage={false}
        />
      </TableHolder>
    );

    expect(container).toMatchSnapshot();
  });

  it('check for pagination buttons when page === 0', () => {
    const { container } = render(
      <TableHolder>
        <LazyTablePagination
          page={0}
          rowsPerPage={5}
          onChangePage={jest.fn()}
          onChangeRowsPerPage={jest.fn()}
          rowsPerPageOptions={rowsPerPageOptions}
          lastPage={false}
        />
      </TableHolder>
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    expect(buttons[1].hasAttribute('disabled')).toBe(true);
    expect(buttons[2].hasAttribute('disabled')).toBe(false);
  });

  it('check for pagination buttons when page is last', () => {
    const { container } = render(
      <TableHolder>
        <LazyTablePagination
          page={3}
          rowsPerPage={5}
          onChangePage={jest.fn()}
          onChangeRowsPerPage={jest.fn()}
          rowsPerPageOptions={rowsPerPageOptions}
          lastPage
        />
      </TableHolder>
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(false);
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
    expect(buttons[2].hasAttribute('disabled')).toBe(true);
  });
});
