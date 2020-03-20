import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CONNECTIONS from 'mocks/pda/connections';
import ConnectionsContainer from 'components/Connections/ConnectionsContainer';

describe('<ConnectionsContainer />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify(CONNECTIONS));

    const { container } = render(<ConnectionsContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
