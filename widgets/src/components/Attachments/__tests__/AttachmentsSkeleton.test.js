import React from 'react';
import { render } from '@testing-library/react';

import AttachmentsSkeleton from '../AttachmentsSkeleton';
import 'mocks/i18nMock';

describe('<AttachmentsSkeleton />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(<AttachmentsSkeleton rows={5} />);

    expect(container).toMatchSnapshot();
  });
});
