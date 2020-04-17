import React from 'react';
import { render } from '@testing-library/react';

import Attachment from '../Attachment';
import 'mocks/i18nMock';

describe('<Attachment />', () => {
  it('renders snapshot correctly', () => {
    const onDelete = () => jest.fn();
    const onDownload = () => jest.fn();
    const item = {
      id: '1',
      name: 'test',
    };
    const { container } = render(
      <Attachment item={item} onDelete={onDelete} onDownload={onDownload} />
    );

    expect(container).toMatchSnapshot();
  });
});
