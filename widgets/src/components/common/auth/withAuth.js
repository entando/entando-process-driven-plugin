import React, { useState, useEffect } from 'react';
import { IS_MOCKED_API, LOCAL } from '../../../api/constants';
import Loader from './Loader';
import MissingPermissions from './MissingPermissions';
import {KEYCLOAK_EVENT_TYPE} from '../../../custom-elements/customEventsUtils';

const detectKeycloak = () => window && window.entando && window.entando.keycloak;

const withAuth = (WrappedComponent, permissions = []) => props => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [missingPermissions, setMissingPermissions] = useState([]);

  const loadPermissions = keycloak => {
    if (keycloak) {
      let missing = [...permissions];
      Object.keys(keycloak.resourceAccess).forEach(key => {
        const { roles } = keycloak.resourceAccess[key];
        const remaining = missing.filter(p => !roles.includes(p));
        missing = [...remaining];
      });

      setMissingPermissions(missing);
    }
    setAuthLoaded(true);
  };

  useEffect(() => {
    const keycloak = detectKeycloak();
    if (LOCAL || IS_MOCKED_API || (!keycloak && localStorage.getItem('token'))) {
      loadPermissions();
      //Simulate onReady event for keycloak in local/mock mode
      const widgetEvent = new CustomEvent(KEYCLOAK_EVENT_TYPE, { detail: {eventType:'onReady'} });
      window.dispatchEvent(widgetEvent);
    } else if (keycloak.authenticated) {
      loadPermissions(keycloak);
    } else {
      window.addEventListener('keycloak', ({ detail: { eventType } }) => {
        if (eventType === 'onInit' && keycloak.authenticated) {
          loadPermissions(keycloak);
        }
      });
    }
  }, []);

  if (!authLoaded) {
    return <Loader />;
  }
  if (missingPermissions.length > 0) {
    return <MissingPermissions missingPermissions={missingPermissions} />;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <WrappedComponent {...props} />;
};

export default withAuth;
