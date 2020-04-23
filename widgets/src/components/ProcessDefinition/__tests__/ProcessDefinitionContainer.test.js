import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import mockKeycloak from 'mocks/auth/keycloak';

import { DOMAINS } from 'api/constants';
import ProcessDefinitionContainer from 'components/ProcessDefinition/ProcessDefinitionContainer';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import MOCK_PROCESSES from 'mocks/pda/processes';

mockKeycloak();

describe('<ProcessDefinitionContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const processUrl = `${DOMAINS.PDA}/connections/${connection}/processes/definitions`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.PROCESS_DEFINITION))
      .once(JSON.stringify(MOCK_PROCESSES));

    const { container } = render(<ProcessDefinitionContainer />);

    await wait(() => expect(fetch.mock.calls.length).toBe(2));

    expect(container).toMatchSnapshot();
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(processUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<ProcessDefinitionContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
