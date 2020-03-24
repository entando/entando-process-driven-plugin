import { METHODS, DOMAINS } from 'api/constants';
import utils from 'utils';
import MOCK_ATTACHMENTS from 'mocks/pda/attachments';
import makeRequest from 'api/makeRequest';

export const getAttachments = async (connection, taskId) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/attachments`,
    method: METHODS.GET,
    mockResponse: MOCK_ATTACHMENTS,
    useAuthentication: true,
  });

export const saveAttachment = async (connection, taskId, file) => {
  const convertedFile = await utils.toBase64(file);
  const body = { file: convertedFile };

  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/attachments`,
    method: METHODS.POST,
    body: JSON.stringify(body),
    // headers,
    mockResponse: {},
    useAuthentication: true,
  });
};

export const deleteAttachment = async (connection, taskId, attachmentId) =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/attachments/${attachmentId}`,
    method: METHODS.DELETE,
    mockResponse: {},
    useAuthentication: true,
  });
