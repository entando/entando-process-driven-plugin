import { METHODS } from 'api/constants';
import { WIDGET_CONFIGS } from 'mocks/taskList/configs';
import makeRequest from 'api/makeRequest';

export const getPageWidget = (pageCode, frameId) =>
  makeRequest({
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.GET,
    mockResponse: WIDGET_CONFIGS,
    useAuthentication: true,
  });

export const putPageWidget = (pageCode, frameId, configs) =>
  makeRequest({
    uri: `/api/pages/${pageCode}/widgets/${frameId}`,
    method: METHODS.PUT,
    mockResponse: {},
    body: configs,
    useAuthentication: true,
  });
