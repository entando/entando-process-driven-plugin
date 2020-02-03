import React from 'react';

const KeycloakContext = React.createContext(null);
export default KeycloakContext;

export function withKeycloakContext(Component) {
  return function KeycloakWrapperComponent(props) {
    return (
      <KeycloakContext.Consumer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {value => <Component {...props} keycloak={value} />}
      </KeycloakContext.Consumer>
    );
  };
}
