import React from 'react';
import { render } from '@testing-library/react';

import InternalTableCell from 'components/common/Table/InternalTableCell';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import { normalizeColumns, normalizeRows } from 'components/TaskList/normalizeData';
import jsonRows from 'mocks/pda/tasks.json';
import 'mocks/i18nMock';

const columns = normalizeColumns(
  JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.columns),
  jsonRows.payload[0],
  JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.options),
  jest.fn()
);
const rows = normalizeRows(jsonRows.payload);

describe('<InternalTableCell />', () => {
  it('renders snapshot correctly for a data cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <InternalTableCell column={columns[2]} row={rows[0]} />
          </tr>
        </tbody>
      </table>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly for a custom cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <InternalTableCell column={columns[0]} row={rows[0]} />
          </tr>
        </tbody>
      </table>
    );

    expect(container).toMatchSnapshot();
  });
});
