import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CONNECTIONS from 'mocks/pda/connections';
import TaskListConfig from 'components/TaskList/TaskListConfig';

describe('<TaskListConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify(CONNECTIONS));

    const { container } = render(<TaskListConfig config={{}} />);

    await wait(() => expect(getConnections).toHaveBeenCalled());

    expect(container).toMatchSnapshot();
  });
});
