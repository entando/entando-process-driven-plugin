import React from 'react';
import { render, wait } from '@testing-library/react';

import { DOMAINS } from 'api/constants';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import MOCKED_RESPONSE from 'mocks/pda/processList';
import { ProcessListContainer } from '../ProcessListContainer';
import 'mocks/i18nMock';

describe('<ProcessListContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const processList = `/connections/${connection}/processes/instances?`;

    fetch.once(JSON.stringify(WIDGET_CONFIGS.PROCESS_LIST)).once(JSON.stringify(MOCKED_RESPONSE));

    const { container } = render(<ProcessListContainer />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(processList);
  });
});
