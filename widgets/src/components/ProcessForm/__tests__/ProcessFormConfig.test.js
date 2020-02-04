import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import ProcessFormConfig from 'components/ProcessForm/ProcessFormConfig';

describe('<ProcessFormConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(WIDGET_CONFIGS.PROCESS_FORM))
      .once(JSON.stringify(PROCESSES));

    const { container } = render(
      <ProcessFormConfig pageCode="phase_1_widgets" frameId="1" widgetCode="process_form" />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
