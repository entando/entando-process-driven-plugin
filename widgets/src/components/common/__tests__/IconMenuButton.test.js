import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import IconMenuButton from 'components/common/IconMenuButton';
import '@testing-library/jest-dom/extend-expect';

const menuItems = [
  {
    text: 'Claim',
  },
  {
    text: 'Complete',
  },
  {
    text: 'Diagram',
  },
];

describe('<IconMenuButton />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<IconMenuButton menuItems={menuItems} />);

    expect(container).toMatchSnapshot();
  });

  it('shows expected items when button is clicked', () => {
    const { getByText, getByRole } = render(<IconMenuButton menuItems={menuItems} />);

    fireEvent.click(getByRole('button'));

    expect(getByText('Claim')).toBeInTheDocument();
    expect(getByText('Complete')).toBeInTheDocument();
    expect(getByText('Diagram')).toBeInTheDocument();
  });

  it('onChange to be called when button is clicked', () => {
    const onClick = jest.fn();
    menuItems[0].onClick = onClick;

    const { getByRole, getByText } = render(
      <IconMenuButton menuItems={menuItems} onClick={onClick} />
    );

    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('Claim'));

    expect(onClick).toHaveBeenCalled();
  });
});
