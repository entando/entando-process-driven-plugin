import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';
import { getConnections } from 'api/pda/connections';
import mockKeycloak from 'mocks/auth/keycloak';

import CONNECTIONS from 'mocks/pda/connections';
import TaskListConfig from 'components/TaskList/TaskListConfig';

mockKeycloak();

jest.mock('api/pda/connections');

beforeEach(() => {
  getConnections.mockClear();
});

describe('<TaskListConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));

    const { container } = render(<TaskListConfig config={{}} />);

    await wait(() => expect(getConnections).toHaveBeenCalled());

    expect(container).toMatchSnapshot();
  });
});
