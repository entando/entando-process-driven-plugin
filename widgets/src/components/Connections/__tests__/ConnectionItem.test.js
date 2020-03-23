/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import ConnectionItem from 'components/Connections/ConnectionItem';

const props = {
  classes: {},
  connection: {
    name: 'test',
    engine: 'pda',
    schema: 'http',
    host: 'entando.com',
    app: '/test',
    username: 'test',
    connectionTimeout: '1000',
  },
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onTest: jest.fn(),
};

describe('<ConnectionItem />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<ConnectionItem {...props} />);

    expect(container).toMatchSnapshot();
  });
});
