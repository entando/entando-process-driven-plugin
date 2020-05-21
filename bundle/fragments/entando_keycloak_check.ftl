<script src="http://pda-kc-pda-namespace.51.91.30.184.nip.io/auth/js/keycloak.js"></script>
<script>
  const beginKCLoad = (function() {
    function createKcDispatcher(payload) {
      return () => window.dispatchEvent(new CustomEvent('keycloak', { detail: payload }));
    }

    function initKeycloak() {
      const keycloak = Keycloak('/entando-de-app/keycloak.json');

      keycloak.onReady = () => {
        console.log('dispatching onReady()');
        createKcDispatcher({ eventType: 'onReady' })();
      };
      keycloak.onAuthSuccess = () => {
        console.log('dispatching onAuthSuccess()', keycloak.token);
        createKcDispatcher({ eventType: 'onAuthSuccess' });
        localStorage.setItem('token', keycloak.token);
      };
      keycloak.onAuthError = () => {
        console.log('dispatching onAuthError()');
        createKcDispatcher({ eventType: 'onAuthError' });
      };
      keycloak.onAuthRefreshSuccess = () => {
        console.log('dispatching onAuthRefreshSuccess()');
        createKcDispatcher({ eventType: 'onAuthRefreshSuccess' });
        localStorage.setItem('token', keycloak.token);
      };
      keycloak.onAuthRefreshError = () => {
        console.log('dispatching onAuthRefreshError()');
        createKcDispatcher({ eventType: 'onAuthRefreshError' });
      };
      keycloak.onAuthLogout = () => {
        console.log('dispatching onAuthLogout()');
        createKcDispatcher({ eventType: 'onAuthLogout' });
      };
      keycloak.onTokenExpired = () => {
        console.log('dispatching onTokenExpired()');
        createKcDispatcher({ eventType: 'onTokenExpired' });
        keycloak.login({ redirectUri: location.protocol+'//'+location.host+'/entando-de-app/en/pda_after_login.page?redirectUri='+location.pathname });
      };
      const onInit = (isAuth) => {
        console.log('dispatching onInit()');
        createKcDispatcher({ eventType: 'onInit' })();
        if (isAuth) {
          localStorage.setItem('token', keycloak.token);
        } else {
          keycloak.login({ redirectUri: location.protocol+'//'+location.host+'/entando-de-app/en/pda_after_login.page?redirectUri='+location.pathname });
        }
      };

      window.entando = {
        ...(window.entando || {}),
        keycloak,
      };

      window.entando.keycloak
        .init({
          onLoad: 'check-sso',
          promiseType: 'native',
          enableLogging: true,
        })
        .then(onInit)
        .catch(e => {
          console.log(e);
          console.log('Failed to initialize Keycloak');
        });
    }
    return initKeycloak;
  })();
 beginKCLoad();
</script>