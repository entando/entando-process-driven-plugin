import React from 'react';
import { render } from '@testing-library/react';

import Attachment from '../Attachment';
import 'mocks/i18nMock';

describe('<Attachment />', () => {
  it('renders snapshot correctly', () => {
    const onDelete = () => jest.fn();
    const downloadLink = '/test';
    const item = {
      id: '1',
      name: 'test',
    };
    const { container } = render(
      <Attachment item={item} onDelete={onDelete} downloadLink={downloadLink} />
    );

    expect(container).toMatchSnapshot();
  });
});
