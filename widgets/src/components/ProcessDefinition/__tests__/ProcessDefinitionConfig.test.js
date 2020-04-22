import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CONNECTIONS from 'mocks/pda/connections';
import ProcessDefinitionConfig from 'components/ProcessDefinition/ProcessDefinitionConfig';

describe('<ProcessDefinitionConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify(CONNECTIONS));

    const { container } = render(<ProcessDefinitionConfig config={{}} />);

    await wait(() => expect(fetch.mock.calls.length).toBe(1));

    expect(container).toMatchSnapshot();
  });
});
