import React from 'react';
import { render } from '@testing-library/react';

import InternalTableHeader from 'components/common/Table/InternalTableHeader';
import columns from 'mocks/taskList/columns';

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
