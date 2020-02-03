import React from 'react';

import Loader from 'components/common/authentication/Loader';
import NotAuthenticated from 'components/common/authentication/NotAuthenticated';
import MissingPermissions from 'components/common/authentication/MissingPermissions';

export default function withAuth(AuthenticatedComponent, permissions = []) {
  return class AuthenticationWrapper extends React.Component {
    static getKeycloak() {
      return (window && window.entando && window.entando.keycloak) || null;
    }

    constructor(props) {
      super(props);

      this.state = {
        initialized: false, // keycloak is ready
        authenticated: false, // user is logged-in
        authorized: false, // user has correct access rights (roles)
        missingPermissions: [],
      };

      this.handleKeycloakEvent = this.handleKeycloakEvent.bind(this);
      this.manageAuthentication = this.manageAuthentication.bind(this);
    }

    componentDidMount() {
      window.addEventListener('keycloak', this.handleKeycloakEvent);

      this.manageAuthentication();
    }

    componentWillUnmount() {
      window.removeEventListener('keycloak', this.handleKeycloakEvent);
    }

    handleKeycloakEvent() {
      this.manageAuthentication();
    }

    manageAuthentication() {
      const keycloak = AuthenticationWrapper.getKeycloak();

      if (keycloak) {
        if (!keycloak.authenticated) {
          this.setState({
            initialized: true,
            authenticated: keycloak.authenticated || false,
          });
        } else {
          const userRoles =
            (keycloak.clientId &&
              keycloak.resourceAccess &&
              keycloak.resourceAccess[keycloak.clientId] &&
              keycloak.resourceAccess[keycloak.clientId].roles) ||
            [];
          const missingPermissions = permissions.filter(
            neededPermission => !userRoles.includes(neededPermission)
          );

          this.setState({
            initialized: true,
            authenticated: keycloak.authenticated || false,
            missingPermissions,
          });
        }
      }
    }

    render() {
      const { authenticated, initialized, missingPermissions } = this.state;

      // if there are no mandatory permissions, component can be displayed as is
      if (permissions.length === 0 || process.env.REACT_APP_DISABLE_KEYCLOAK === 'true') {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <AuthenticatedComponent {...this.props} />;
      }

      if (permissions.length > 0) {
        // if keycloak is has not been initialized yet
        if (!initialized) {
          return <Loader />;
        }

        if (!authenticated) {
          return <NotAuthenticated />;
        }

        if (missingPermissions.length > 0) {
          return <MissingPermissions missingPermissions={missingPermissions} />;
        }

        // eslint-disable-next-line react/jsx-props-no-spreading
        return <AuthenticatedComponent {...this.props} />;
      }

      return null;
    }
  };
}
