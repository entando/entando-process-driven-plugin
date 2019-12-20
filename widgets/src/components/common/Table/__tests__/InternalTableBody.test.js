import React from 'react';
import { render } from '@testing-library/react';

import InternalTableBody from 'components/common/Table/InternalTableBody';
import columns from 'mocks/taskList/columns';
import rows from 'mocks/taskList/rows';

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
