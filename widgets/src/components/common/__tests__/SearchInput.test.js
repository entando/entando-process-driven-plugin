import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchInput from 'components/common/SearchInput';
import '@testing-library/jest-dom/extend-expect';
import 'mocks/i18nMock';

describe('<SearchInput />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<SearchInput onChange={jest.fn()} />);

    expect(container).toMatchSnapshot();
  });

  it('onChange to be called when input change', () => {
    const onChange = jest.fn();
    const value = 'test';
    const { getByRole } = render(<SearchInput onChange={onChange} />);

    fireEvent.change(getByRole('textbox'), { target: { value } });

    expect(onChange).toHaveBeenCalled();
  });
});
