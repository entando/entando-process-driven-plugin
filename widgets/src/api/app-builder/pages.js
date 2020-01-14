import { METHODS } from 'api/constants';
import WIDGET_CONFIG from 'mocks/appBuilder/widgetConfig';
import makeRequest from 'api/makeRequest';

export const getPageWidget = (pageCode, frameId) =>
  makeRequest({
    domain: process.env.REACT_APP_APP_BUILDER_DOMAIN,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: WIDGET_CONFIG,
    useAuthentication: true,
  });

export const putPageWidget = (pageCode, frameId, configs) =>
  makeRequest({
    domain: process.env.REACT_APP_APP_BUILDER_DOMAIN,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.PUT,
    mockResponse: {},
    body: configs,
    useAuthentication: true,
  });

// for ease of development
export const authenticate = async () => {
  const formData = {
    username: 'admin',
    password: 'adminadmin',
    grant_type: 'password',
  };
  return makeRequest({
    domain: process.env.REACT_APP_APP_BUILDER_DOMAIN,
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
