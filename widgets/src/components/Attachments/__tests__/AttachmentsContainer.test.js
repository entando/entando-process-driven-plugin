import React from 'react';
import { render, wait } from '@testing-library/react';

import { DOMAINS } from 'api/constants';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import PARAMS from 'mocks/app-builder/widgets';
import MOCKED_ATTACHMENTS_RESPONSE from 'mocks/pda/attachments';
import AttachmentsContainer from '../AttachmentsContainer';
import 'mocks/i18nMock';

describe('<AttachmentsContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const { taskId } = PARAMS.ATTACHMENTS;
    const attachmentsList = `/connections/${connection}/tasks/${taskId}/attachments`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.ATTACHMENTS))
      .once(JSON.stringify(MOCKED_ATTACHMENTS_RESPONSE));

    const { container } = render(<AttachmentsContainer taskId={taskId} />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(attachmentsList);
  });
});
