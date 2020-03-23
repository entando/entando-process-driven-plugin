import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';
import mockKeycloak from 'mocks/auth/keycloak';

import CONNECTIONS from 'mocks/pda/connections';
import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';

import { getConnections } from 'api/pda/connections';

mockKeycloak();

jest.mock('api/pda/connections');

beforeEach(() => {
  getConnections.mockClear();
  getProcesses.mockClear();
  getPageWidget.mockClear();
  putPageWidget.mockClear();
});

describe('<TaskCompletionFormConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));

    const { container } = render(<TaskCompletionFormConfig config={{}} />);

    await wait(() => expect(getConnections).toHaveBeenCalled());

    expect(container).toMatchSnapshot();
  });
});
