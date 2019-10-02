import React from 'react';
import { cleanup, render } from '@testing-library/react';

import InternalTablePaginationActions from 'components/common/Table/InternalTablePaginationActions';

describe('<InternalTablePaginationActions />', () => {
  afterEach(cleanup);

  it('renders snapshot correctly', () => {
    const { container } = render(
      <InternalTablePaginationActions
        page={0}
        count={42}
        rowsPerPage={5}
        onChangePage={jest.fn()}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('check for pagination buttons when page === 0', () => {
    const { container } = render(
      <InternalTablePaginationActions
        page={0}
        count={42}
        rowsPerPage={5}
        onChangePage={jest.fn()}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    expect(buttons[1].hasAttribute('disabled')).toBe(true);
    expect(buttons[2].hasAttribute('disabled')).toBe(false);
    expect(buttons[3].hasAttribute('disabled')).toBe(false);
  });

  it('check for pagination buttons when page === 2', () => {
    const { container } = render(
      <InternalTablePaginationActions
        page={2}
        count={42}
        rowsPerPage={5}
        onChangePage={jest.fn()}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(false);
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
    expect(buttons[2].hasAttribute('disabled')).toBe(false);
    expect(buttons[3].hasAttribute('disabled')).toBe(false);
  });

  it('check for pagination buttons when page is last page', () => {
    const { container } = render(
      <InternalTablePaginationActions
        page={5}
        count={42}
        rowsPerPage={10}
        onChangePage={jest.fn()}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].hasAttribute('disabled')).toBe(false);
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
    expect(buttons[2].hasAttribute('disabled')).toBe(true);
    expect(buttons[3].hasAttribute('disabled')).toBe(true);
  });
});
