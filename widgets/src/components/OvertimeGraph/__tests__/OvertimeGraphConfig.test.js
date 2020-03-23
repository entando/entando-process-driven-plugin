import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';
import mockKeycloak from 'mocks/auth/keycloak';

import PAGE_CONFIG from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import OvertimeGraphConfig from 'components/OvertimeGraph/OvertimeGraphConfig';

mockKeycloak();

describe('<OvertimeGraphConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify(CONNECTIONS)).once(JSON.stringify(PAGE_CONFIG.OVERTIME_GRAPH));

    const { container } = render(<OvertimeGraphConfig config={{}} />);

    await wait(() => expect(fetch.mock.calls.length).toBe(1));

    expect(container).toMatchSnapshot();
  });
});
