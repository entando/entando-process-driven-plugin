import { METHODS, DOMAINS } from 'api/constants';
import { WIDGET_CONFIGS } from 'mocks/taskList/configs';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getPageWidget = (pageCode, frameId) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: WIDGET_CONFIGS,
    useAuthentication: true,
    // forceMock: true,
  });

export const putPageWidget = (pageCode, frameId, configs) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.PUT,
    mockResponse: {},
    body: configs,
    useAuthentication: true,
  });
