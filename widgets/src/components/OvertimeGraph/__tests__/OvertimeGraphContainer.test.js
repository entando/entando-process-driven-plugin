import React from 'react';
import { render } from '@testing-library/react';

import OvertimeGraphContainer from 'components/OvertimeGraph/OvertimeGraphContainer';

describe('<OvertimeGraphContainer />', () => {
  it('should match snapshot', () => {
    const { container } = render(<OvertimeGraphContainer />);
    expect(container).toMatchSnapshot();
  });
});
