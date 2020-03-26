import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AddAttachmentModal from '../AddAttachmentModal';
import 'mocks/i18nMock';

describe('<AddAttachmentModal />', () => {
  it('renders snapshot correctly', () => {
    const onClose = jest.fn();
    const onUpload = jest.fn();
    const { container } = render(<AddAttachmentModal onClose={onClose} onUpload={onUpload} />);

    expect(container).toMatchSnapshot();
  });

  it('onClose to be called when close button is clicked', () => {
    const onClose = jest.fn();
    const onUpload = jest.fn();
    const { getAllByRole } = render(<AddAttachmentModal onClose={onClose} onUpload={onUpload} />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(onClose).toHaveBeenCalled();
  });
});
