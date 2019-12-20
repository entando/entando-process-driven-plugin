import React from 'react';
import { render } from '@testing-library/react';

import InternalTableCell from 'components/common/Table/InternalTableCell';
import columns from 'mocks/taskList/columns';
import rows from 'mocks/taskList/rows';

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
