import React from 'react';
import PropTypes from 'prop-types';
import Keycloak from 'keycloak-js';

import Notification from '../common/Notification';
import LoggedIn from '../UserAuth/LoggedIn';
import LoggedOut from '../UserAuth/LoggedOut';

class UserAuth extends React.Component {
  static createKcDispatcher(payload) {
    // 'detail' is used per CustomEvent interface definition
    return () => window.dispatchEvent(new CustomEvent('keycloak', { detail: payload }));
  }

  static onInit() {
    UserAuth.createKcDispatcher({ eventType: 'onInit' })();
  }

  constructor(props) {
    super(props);

    const { keycloakAuthUrl: url, keycloakRealm: realm, keycloakClientId: clientId } = props;

    const keycloak = Keycloak(
      url
        ? {
            url,
            realm,
            clientId,
          }
        : `${process.env.REACT_APP_APP_BUILDER_DOMAIN}/keycloak.json`
    );

    keycloak.onReady = () => {
      UserAuth.createKcDispatcher({ eventType: 'onReady' })();
    };
    keycloak.onAuthSuccess = () => {
      UserAuth.createKcDispatcher({ eventType: 'onAuthSuccess' });
    };
    keycloak.onAuthError = () => {
      UserAuth.createKcDispatcher({ eventType: 'onAuthError' });
    };
    keycloak.onAuthRefreshSuccess = () => {
      UserAuth.createKcDispatcher({ eventType: 'onAuthRefreshSuccess' });
    };
    keycloak.onAuthRefreshError = () => {
      UserAuth.createKcDispatcher({ eventType: 'onAuthRefreshError' });
    };
    keycloak.onAuthLogout = () => {
      UserAuth.createKcDispatcher({ eventType: 'onAuthLogout' });
    };
    keycloak.onTokenExpired = () => {
      UserAuth.createKcDispatcher({ eventType: 'onTokenExpired' });
    };

    this.state = {
      keycloak,
      authenticated: false,
      user: null,
      errorMessage: '',
    };

    this.onClickLogin = this.onClickLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { keycloak } = this.state;

    keycloak
      .init({
        promiseType: 'native',
        enableLogging: true,
        onLoad: 'check-sso',
      })
      .then(authenticated => {
        UserAuth.onInit();
        if (authenticated) {
          keycloak.loadUserProfile().then(user => {
            this.setState({ user, authenticated });
            localStorage.setItem('token', keycloak.token);
          });
        } else {
          this.setState({ authenticated });
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  onClickLogin() {
    const { keycloak, authenticated } = this.state;

    if (keycloak && !authenticated) {
      keycloak.login({ redirectUri: window.location });
    }
  }

  onClickLogout() {
    const { keycloak } = this.state;
    if (keycloak) {
      keycloak.logout();
    }
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  handleError(error) {
    const { onError } = this.props;
    onError(error);

    this.setState({
      errorMessage: error.toString(),
    });
  }

  render() {
    const { authenticated, user, errorMessage } = this.state;

    return (
      <>
        {authenticated ? (
          <LoggedIn user={user} onClickLogout={this.onClickLogout} />
        ) : (
          <LoggedOut onClickLogin={this.onClickLogin} />
        )}
        <Notification type="error" message={errorMessage} onClose={this.closeNotification} />
      </>
    );
  }
}

UserAuth.propTypes = {
  keycloakAuthUrl: PropTypes.string,
  keycloakRealm: PropTypes.string,
  keycloakClientId: PropTypes.string,
  onError: PropTypes.func,
};

UserAuth.defaultProps = {
  keycloakAuthUrl: '',
  keycloakRealm: '',
  keycloakClientId: '',
  onError: () => {},
};

export default UserAuth;
