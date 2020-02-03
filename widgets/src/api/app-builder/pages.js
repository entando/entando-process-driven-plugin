import { METHODS, DOMAINS } from 'api/constants';
import WIDGET_CONFIG_MOCKUPS from 'mocks/app-builder/pages';
import makeRequest from 'api/makeRequest';

// TODO: widgetType should be removed
export const getPageWidget = (pageCode, frameId, widgetType) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: WIDGET_CONFIG_MOCKUPS[widgetType],
    useAuthentication: true,
    authMethod: 'entando-api',
    // forceMock: true,
  });

export const putPageWidget = (pageCode, frameId, configs) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.PUT,
    body: configs,
    useAuthentication: true,
    authMethod: 'entando-api',
  });

// TODO: for ease of development - remove when authetication token is managed by wrapper
export const authenticate = async () => {
  const formData = {
    username: 'admin',
    password: 'adminadmin',
    grant_type: 'password',
  };
  return makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: '/api/oauth/token',
    method: METHODS.POST,
    mockResponse: {
      access_token: 'MOCKED_ACCESS_TOKEN',
      token_type: 'bearer',
      refresh_token: 'MOCKED_REFRESH_TOKEN',
      expires_in: 3599,
    },
    body: Object.keys(formData)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
      .join('&'),
    useAuthentication: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa('appbuilder:appbuilder_secret')}`,
    },
  });
};
