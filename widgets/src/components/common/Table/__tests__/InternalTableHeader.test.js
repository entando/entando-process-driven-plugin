import React from 'react';
import { render } from '@testing-library/react';

import InternalTableHeader from 'components/common/Table/InternalTableHeader';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import { normalizeColumns } from 'components/TaskList/normalizeData';
import jsonRows from 'mocks/pda/tasks.json';

const columns = normalizeColumns(
  JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.columns),
  jsonRows.payload[0],
  JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.options)
);

describe('<InternalTableHeader />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <InternalTableHeader column={columns[2]} sortOrder="asc" />
          </tr>
        </thead>
      </table>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly without sort functionality', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <InternalTableHeader column={columns[0]} sortOrder="asc" />
          </tr>
        </thead>
      </table>
    );

    expect(container).toMatchSnapshot();
  });
});
