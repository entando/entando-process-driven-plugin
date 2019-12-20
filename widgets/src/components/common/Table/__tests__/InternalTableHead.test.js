import React from 'react';
import { render } from '@testing-library/react';

import InternalTableHead from 'components/common/Table/InternalTableHead';
import columns from 'mocks/taskList/columns';

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
