import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActionCell from 'components/common/Table/custom/ActionCell';

describe('<ActionCell />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<ActionCell />);

    expect(container).toMatchSnapshot();
  });

  it('shows Claim, Complete and Diagram buttons when button is clicked', () => {
    const { getByText, getByRole } = render(<ActionCell />);

    fireEvent.click(getByRole('button'));

    expect(getByText('Claim')).toBeInTheDocument();
    expect(getByText('Complete')).toBeInTheDocument();
    expect(getByText('Diagram')).toBeInTheDocument();
  });
});
