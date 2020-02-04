import { render } from '@testing-library/react';
import React from 'react';
import 'mocks/i18nMock';

import CompletionForm from 'components/TaskCompletionForm/CompletionForm';

describe('<CompletionForm />', () => {
  it('renders snapshot correctly', async () => {
    const { container } = render(<CompletionForm />);

    expect(container).toMatchSnapshot();
  });
});
