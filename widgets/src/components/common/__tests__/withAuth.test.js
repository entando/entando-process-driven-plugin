import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';

import 'mocks/i18nMock';
import withAuth from 'components/common/authentication/withAuth';
import mockKeycloak from 'mocks/auth/keycloak';

const AuthenticatedComponent = ({ value }) => <div>{value}</div>;
AuthenticatedComponent.propTypes = { value: PropTypes.string.isRequired };

// beforeEach(() => {
//   window.entando = {};
// });

describe('withAuth()', () => {
  it('passes props through', async () => {
    const ComponentWithAuth = withAuth(AuthenticatedComponent);

    const { container } = render(<ComponentWithAuth value="Some value" />);

    expect(container).toMatchSnapshot();
  });

  it('shows loading screen when keycloak is not initialized', async () => {
    const ComponentWithAuth = withAuth(AuthenticatedComponent, ['unmet-permission']);

    const { container } = render(<ComponentWithAuth value="Some value" />);

    expect(container).toMatchSnapshot();
  });

  it('shows that permissions are not met', async () => {
    mockKeycloak();
    const ComponentWithAuth = withAuth(AuthenticatedComponent, ['unmet-permission']);

    render(<ComponentWithAuth value="Some value" />);

    expect(
      screen.getByText('authentication.missingPermissions: unmet-permission.')
    ).toBeInTheDocument();
  });

  it('shows widget when keycloak is initialized and permissions are met', async () => {
    mockKeycloak();
    const ComponentWithAuth = withAuth(AuthenticatedComponent, ['task-list']);

    const { container } = render(<ComponentWithAuth value="Some value" />);

    expect(container).toMatchSnapshot();
  });
});
