import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CONNECTIONS from 'mocks/pda/connections';
import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';

import { getConnections } from 'api/pda/connections';

jest.mock('api/pda/connections');

beforeEach(() => {
  getConnections.mockClear();
});

describe('<TaskCommentsConfig />', () => {
  it('renders snapshot correctly', async () => {
    getConnections.mockImplementation(() => Promise.resolve(CONNECTIONS));

    const { container } = render(<TaskCommentsConfig config={{}} />);

    await wait(() => expect(getConnections).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });
});
