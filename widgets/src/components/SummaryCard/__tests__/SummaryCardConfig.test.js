import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import PAGE_CONFIG from 'mocks/app-builder/pages';
import MOCK_SUMMARIES from 'mocks/summary/summaries';
import CONNECTIONS from 'mocks/pda/connections';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

describe('<SummaryCardConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch
      .once(JSON.stringify(CONNECTIONS))
      .once(JSON.stringify(PAGE_CONFIG.SUMMARY_CARD))
      .once(JSON.stringify(MOCK_SUMMARIES));

    const { container } = render(<SummaryCardConfig config={{}} />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
