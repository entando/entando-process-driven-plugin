import React from 'react';
import { render } from '@testing-library/react';

import InternalTableHead from 'components/common/Table/InternalTableHead';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import { normalizeColumns } from 'components/TaskList/normalizeData';
import jsonRows from 'mocks/pda/tasks.json';

const columns = normalizeColumns(
  JSON.parse(WIDGET_CONFIGS.payload.config.columns),
  jsonRows.payload[0],
  JSON.parse(WIDGET_CONFIGS.payload.config.options)
);

describe('<InternalTableHead />', () => {
  it('renders snapshot correctly', () => {
    const columnNumber = 2;
    const { container } = render(
      <table>
        <InternalTableHead columns={columns.slice(0, columnNumber)} />
      </table>
    );

    expect(container).toMatchSnapshot();
    expect(document.querySelectorAll('th').length).toBe(columnNumber);
  });
});
