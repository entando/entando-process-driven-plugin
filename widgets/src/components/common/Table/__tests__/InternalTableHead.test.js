import React from 'react';
import { render } from '@testing-library/react';

import InternalTableHead from 'components/common/Table/InternalTableHead';
import { WIDGET_CONFIGS } from 'mocks/taskList/configs';
import { normalizeColumns } from 'components/TaskList/normalizeData';
import jsonRows from 'mocks/taskList/tasks';

const columns = normalizeColumns(
  JSON.parse(WIDGET_CONFIGS.payload.config.columns),
  jsonRows.payload[0]
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
