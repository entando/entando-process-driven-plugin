import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import PAGE_CONFIG from 'mocks/app-builder/pages';
import { MOCK_SUMMARY_DATATYPES } from 'mocks/summary/summary';
import CONNECTIONS from 'mocks/pda/connections';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

describe('<SummaryCardConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(PAGE_CONFIG.SUMMARY_CARD))
      .once(JSON.stringify(MOCK_SUMMARY_DATATYPES));

    const { container } = render(
      <SummaryCardConfig
        pageCode={WIDGETS_CONFIG.SUMMARY_CARD.pageCode}
        frameId={WIDGETS_CONFIG.SUMMARY_CARD.frameId}
        widgetCode={WIDGETS_CONFIG.SUMMARY_CARD.widgetCode}
      />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
