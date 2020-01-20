import React from 'react';
import { cleanup, render } from '@testing-library/react';

import Table, { swapOrder } from 'components/common/Table/Table';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import { normalizeColumns, normalizeRows } from 'components/TaskList/normalizeData';
import jsonRows from 'mocks/pda/tasks.json';
import 'mocks/i18nMock';

const columns = normalizeColumns(
  JSON.parse(WIDGET_CONFIGS.payload.config.columns),
  jsonRows.payload[0],
  JSON.parse(WIDGET_CONFIGS.payload.config.options),
  jest.fn()
);
const rows = normalizeRows(jsonRows.payload);

describe('<Table />', () => {
  afterEach(cleanup);

  it('renders snapshot correctly', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly when empty', () => {
    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly with no footer', () => {
    const { container } = render(<Table columns={columns} rows={rows} hidePagination />);

    expect(container).toMatchSnapshot();
  });

  it('when clicking on next button it should change the page', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);

    expect(container).toMatchSnapshot();
  });
});

describe('swapOrder', () => {
  it('swapOrder to return "asc" when given "desc"', () => {
    expect(swapOrder('desc')).toBe('asc');
  });

  it('swapOrder to return "desc" when given "asc"', () => {
    expect(swapOrder('asc')).toBe('desc');
  });
});
