export const TEST_CONNECTION = {
  payload: 'OK',
  errors: [],
};

export const DELETE_CONNECTION = {
  payload: 'OK',
  errors: [],
};

export const SAVE_CONNECTION = {
  payload: {
    name: 'kieStaging2',
    host: 'rhpam7-install-kieserver-rhpam7-install-entando.apps.serv.run',
    port: '80',
    schema: 'http',
    app: '/services/rest/server',
    username: 'pamAdmin',
    connectionTimeout: 60000,
    engine: 'pam',
  },
  errors: [],
};

export default {
  payload: [
    {
      name: 'kieStaging',
      url: 'http://rhpam7-install-kieserver-rhpam7-install-entando.apps.serv.run:80/services/rest/',
      username: 'pamAdmin',
      connectionTimeout: 60000,
      engine: 'pam',
    },
    {
      name: 'kie2Server',
      url: 'http://rhpam7-install-kieserver-rhpam7-install-entando.apps.serv.run:80/services/rest/',
      username: 'pamAdmin',
      connectionTimeout: 60000,
      engine: 'pam',
    },
    {
      name: 'test',
      url: 'http://rhpam7-install-kieserver-rhpam7-install-entando.apps.serv.run:80/services/rest/',
      username: 'pamAdmin',
      connectionTimeout: 60000,
      engine: 'pam',
    },
  ],
  errors: {},
};
