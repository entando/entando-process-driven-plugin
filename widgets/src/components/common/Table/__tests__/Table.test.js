import React from 'react';
import { cleanup, render } from '@testing-library/react';

import Table, { swapOrder } from 'components/common/Table/Table';
import columns from 'mocks/taskList/columns';
import rows from 'mocks/taskList/rows';
import 'mocks/i18nMock';

describe('<Table />', () => {
  afterEach(cleanup);

  it('renders snapshot correctly when empty', () => {
    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly when empty', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly with no header and no footer', () => {
    const { container } = render(<Table columns={columns} rows={rows} hidePagination />);

    expect(container).toMatchSnapshot();
  });

  it('swapOrder to return "asc" when given "desc"', () => {
    expect(swapOrder('desc')).toBe('asc');
  });

  it('swapOrder to return "desc" when given "asc"', () => {
    expect(swapOrder('asc')).toBe('desc');
  });
});
