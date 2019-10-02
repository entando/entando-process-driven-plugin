import React from 'react';
import { render } from '@testing-library/react';
import EmptyRow from 'components/common/Table/EmptyRow';

describe('<EmptyRow />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(
      <table>
        <EmptyRow />
      </table>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly with custom message', () => {
    const { container } = render(
      <table>
        <EmptyRow text="test message" />
      </table>
    );

    expect(container).toMatchSnapshot();
  });
});
