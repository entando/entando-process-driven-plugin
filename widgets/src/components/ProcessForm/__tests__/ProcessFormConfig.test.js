import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';
import mockKeycloak from 'mocks/auth/keycloak';

import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import ProcessFormConfig from 'components/ProcessForm/ProcessFormConfig';

mockKeycloak();

describe('<ProcessFormConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS));

    const { container } = render(<ProcessFormConfig config={{}} />);

    await wait(() => expect(fetch.mock.calls.length).toBe(1));

    expect(container).toMatchSnapshot();
  });
});
