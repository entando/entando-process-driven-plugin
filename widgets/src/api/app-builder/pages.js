import { METHODS, DOMAINS } from 'api/constants';
import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import WIDGET_CONFIG_MOCKUPS from 'mocks/app-builder/pages';
import makeRequest from 'api/makeRequest';

// used to fetch mock response using frameId, it depends on WIDGETS_CONFIG setup
const getWidgetConfigMockResponse = frameId => {
  const widgetType = Object.keys(WIDGETS_CONFIG).find(
    iteratedType => WIDGETS_CONFIG[iteratedType].frameId === frameId
  );
  return WIDGET_CONFIG_MOCKUPS[widgetType];
};

export const getPageWidget = (pageCode, frameId) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: getWidgetConfigMockResponse(frameId) || {},
    useAuthentication: true,
    // forceMock: true,
  });

export const putPageWidget = (pageCode, frameId, configs) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.PUT,
    body: configs,
    useAuthentication: true,
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
