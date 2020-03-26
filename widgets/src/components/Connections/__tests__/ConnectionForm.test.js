/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import ConnectionForm from 'components/Connections/ConnectionForm';

const props = {
  classes: {},
  form: {
    name: 'test',
    engine: 'pda',
    schema: 'http',
    host: 'entando.com',
    app: '/test',
    username: 'test',
    password: '123',
  },
  onChange: jest.fn(),
  onCancel: jest.fn(),
  onSave: jest.fn(),
};

describe('<ConnectionForm />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<ConnectionForm {...props} />);

    expect(container).toMatchSnapshot();
  });
});
