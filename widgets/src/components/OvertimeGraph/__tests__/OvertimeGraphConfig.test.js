import { render, wait } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import PAGE_CONFIG from 'mocks/app-builder/pages';
import CONNECTIONS from 'mocks/pda/connections';
import OvertimeGraphConfig from 'components/OvertimeGraph/OvertimeGraphConfig';

describe('<OvertimeGraphConfig />', () => {
  it('renders snapshot correctly', async () => {
    fetch.once(JSON.stringify(CONNECTIONS)).once(JSON.stringify(PAGE_CONFIG.OVERTIME_GRAPH));

    const { container } = render(
      <OvertimeGraphConfig
        pageCode={WIDGETS_CONFIG.OVERTIME_GRAPH.pageCode}
        frameId={WIDGETS_CONFIG.OVERTIME_GRAPH.frameId}
        widgetCode={WIDGETS_CONFIG.OVERTIME_GRAPH.widgetCode}
      />
    );

    await wait(() => expect(container).toMatchSnapshot());
  });
});
