import React, { useState, useEffect } from 'react';
import { IS_MOCKED_API, LOCAL } from 'api/constants';
import Loader from 'components/common/auth/Loader';
import MissingPermissions from 'components/common/auth/MissingPermissions';

const detectKeycloak = () => window && window.entando && window.entando.keycloak;

const withAuth = (WrappedComponent, permissions = []) => props => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [missingPermissions, setMissingPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const loadPermissions = keycloak => {
    if (keycloak) {
      const roles =
        (keycloak.clientId &&
          keycloak.resourceAccess &&
          keycloak.resourceAccess[keycloak.clientId] &&
          keycloak.resourceAccess[keycloak.clientId].roles) ||
        [];
      setMissingPermissions(
        permissions.filter(neededPermission => !roles.includes(neededPermission))
      );
      setUserRoles(roles);
    }
    setAuthLoaded(true);
  };

  useEffect(() => {
    const beginCheck = async () => {
      const keycloak = detectKeycloak();
      if (LOCAL || IS_MOCKED_API || (!keycloak && localStorage.getItem('token'))) {
        loadPermissions();
      } else if (keycloak.authenticated) {
        loadPermissions(keycloak);
      } else {
        window.addEventListener('keycloak', ({ detail: { eventType } }) => {
          if (eventType === 'onInit' && keycloak.authenticated) {
            loadPermissions(keycloak);
          }
        });
      }
    };
    beginCheck();
  }, []);

  if (!authLoaded) {
    return <Loader />;
  }
  if (missingPermissions.length > 0) {
    return <MissingPermissions missingPermissions={missingPermissions} />;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <WrappedComponent {...props} userRoles={userRoles} />;
};

export default withAuth;
