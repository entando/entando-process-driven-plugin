import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import { DOMAINS } from 'api/constants';
import SummaryCardContainer from 'components/SummaryCard/SummaryCardContainer';
import mockSummary from 'mocks/summary/summary';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';

describe('<SummaryCardContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const summaryUrl = `/connections/${connection}/summaries/summaryTypes/Card`;

    fetch.once(JSON.stringify(WIDGET_CONFIGS.SUMMARY_CARD)).once(JSON.stringify(mockSummary));

    const { container } = render(<SummaryCardContainer />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(summaryUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<SummaryCardContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
