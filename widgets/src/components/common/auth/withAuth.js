import React, { useState, useEffect } from 'react';
import { IS_MOCKED_API, LOCAL } from 'api/constants';
import utils from 'utils';
import Loader from 'components/common/auth/Loader';
import MissingPermissions from 'components/common/auth/MissingPermissions';

const detectKeycloak = () => window && window.entando && window.entando.keycloak;

const withAuth = (WrappedComponent, permissions = []) => props => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [missingPermissions, setMissingPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  useEffect(() => {
    const beginCheck = async () => {
      await utils.timeout(100);
      const keycloak = detectKeycloak();
      if (LOCAL || IS_MOCKED_API || (!keycloak && localStorage.getItem('token'))) {
        loadPermissions();
      } else {
        if (keycloak.authenticated) {
          loadPermissions(keycloak);
        } else {
          window.addEventListener('keycloak', ({ detail: { eventType } }) => {
            if (eventType === 'onInit' && keycloak.authenticated) {
              loadPermissions(keycloak);
            }
          });
        }
      }
    };
    beginCheck();
  }, []);

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

  if (!authLoaded) {
    return <Loader />;
  }
  if (missingPermissions.length > 0) {
    return <MissingPermissions missingPermissions={missingPermissions} />;
  }
  return <WrappedComponent {...props} userRoles={userRoles} />;
};

export default withAuth;
