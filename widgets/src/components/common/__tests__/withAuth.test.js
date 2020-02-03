import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import 'mocks/i18nMock';

import withAuth from 'components/common/authentication/withAuth';

const AuthenticatedComponent = ({ value }) => <div>{value}</div>;
AuthenticatedComponent.propTypes = { value: PropTypes.string.isRequired };

describe('withAuth()', () => {
  it('passes props through', async () => {
    const ComponentWithAuth = withAuth(AuthenticatedComponent);

    const { container } = render(<ComponentWithAuth value="Some value" />);

    expect(container).toMatchSnapshot();
  });

  // it('shows that permissions are not met', async () => {
  //   const ComponentWithAuth = withAuth(AuthenticatedComponent, ['connection-list']);

  //   const { container } = render(<ComponentWithAuth value="Some value" />);

  //   expect(container).toMatchSnapshot();
  // });
});
