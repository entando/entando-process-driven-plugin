import React from 'react';
import { render } from '@testing-library/react';

import InternalTableBody from 'components/common/Table/InternalTableBody';
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

describe('<InternalTableBody />', () => {
  it('renders snapshot correctly', () => {
    const rowsNumber = 2;
    const { container } = render(
      <table>
        <InternalTableBody rows={rows.slice(0, rowsNumber)} columns={columns} emptyRows={0} />
      </table>
    );

    expect(container).toMatchSnapshot();
    expect(document.querySelectorAll('tr').length).toBe(rowsNumber);
  });

  it('renders snapshot correctly with emptyRows', () => {
    const { container } = render(
      <table>
        <InternalTableBody rows={rows.slice(0, 2)} columns={columns} emptyRows={3} />
      </table>
    );

    expect(container).toMatchSnapshot();
  });
});
