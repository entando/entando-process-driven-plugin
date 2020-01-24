import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import PROCESSES from 'mocks/pda/processes';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

describe('<SummaryCardConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(WIDGET_CONFIGS.SUMMARY_CARD))
      .once(JSON.stringify(PROCESSES));

    const { container } = render(
      <SummaryCardConfig pageCode="phase_1_widgets" frameId="1" widgetCode="task_list" />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
