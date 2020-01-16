import { METHODS, DOMAINS } from 'api/constants';
import { taskListConfigs } from 'mocks/app-builder/pages';
import makeRequest from 'api/makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getPageWidget = (pageCode, frameId) =>
  makeRequest({
    domain: DOMAINS.APP_BUILDER,
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: taskListConfigs,
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
