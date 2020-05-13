import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import mockKeycloak from 'mocks/auth/keycloak';

import { DOMAINS } from 'api/constants';
import ProcessFormContainer from 'components/ProcessForm/ProcessFormContainer';
import WIDGETS from 'mocks/app-builder/widgets';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import MOCKED_PROCESS_FORM from 'mocks/process-form/formSchema';

mockKeycloak();

describe('<ProcessFormContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages/${WIDGETS.PROCESS_FORM.pageCode}/widgets/${WIDGETS.PROCESS_FORM.frameId}`;
    const { config } = WIDGET_CONFIGS.PROCESS_FORM.payload;
    const processUrl = `${DOMAINS.PDA}/connections/${config.knowledgeSource}/processes/definitions/${config.process}/form`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.PROCESS_FORM))
      .once(JSON.stringify(MOCKED_PROCESS_FORM));

    const { container } = render(
      <ProcessFormContainer
        frameId={WIDGETS.PROCESS_FORM.frameId}
        pageCode={WIDGETS.PROCESS_FORM.pageCode}
      />
    );

    await wait(() => expect(fetch.mock.calls.length).toBe(2));

    expect(container).toMatchSnapshot();
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(processUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<ProcessFormContainer config={{ knowledgeSource: 'test' }} />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
