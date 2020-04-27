import { render, wait } from '@testing-library/react';
import React from 'react';

import 'mocks/i18nMock';

import App from 'app/App';

describe('<App />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify({ access_token: 'abc' }));
    const { container } = render(<App />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
