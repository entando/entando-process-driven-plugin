import React from 'react';
import { render, wait } from '@testing-library/react';

import { DOMAINS } from 'api/constants';
import MOCK_CHART_SUMMARY from 'mocks/summary/chart';
import OvertimeGraphContainer from 'components/OvertimeGraph/OvertimeGraphContainer';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';

describe('<OvertimeGraphContainer />', () => {
  it('renders snapshot correctly', async () => {
    const configUrl = `${DOMAINS.APP_BUILDER}/api/pages//widgets/`;
    const connection = 'kieStaging';
    const summaryUrl = `/connections/${connection}/summaries/summaryTypes/Chart`;

    fetch
      .once(JSON.stringify(WIDGET_CONFIGS.OVERTIME_GRAPH))
      .once(JSON.stringify(MOCK_CHART_SUMMARY));

    const { container } = render(<OvertimeGraphContainer />);

    await wait(() => expect(container).toMatchSnapshot());

    expect(fetch.mock.calls.length).toBe(2);
    expect(fetch.mock.calls[0][0]).toEqual(configUrl);
    expect(fetch.mock.calls[1][0]).toEqual(summaryUrl);
  });

  it('renders snapshot correctly on error state', async () => {
    const { container } = render(<OvertimeGraphContainer />);

    await wait(() => expect(container).toMatchSnapshot());
  });
});
