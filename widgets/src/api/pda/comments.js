import { METHODS, DOMAINS } from '../constants';

import makeRequest from '../makeRequest';

import MOCKED_GET_TASK_COMMENTS_RESPONSE from '../../mocks/taskComments/getComments';
import MOCKED_POST_COMMENT_RESPONSE from '../../mocks/taskComments/postComment';
import MOCKED_DELETE_COMMENT_RESPONSE from '../../mocks/taskComments/deleteComment';

export const getTaskComments = async (connection, taskId) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/comments`,
    method: METHODS.GET,
    mockResponse: MOCKED_GET_TASK_COMMENTS_RESPONSE,
    useAuthentication: true,
  });
};

export const postTaskComment = async (connection, taskId, comment) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/comments`,
    method: METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment }),
    mockResponse: MOCKED_POST_COMMENT_RESPONSE,
    useAuthentication: true,
  });
};

export const deleteTaskComment = async (connection, taskId, commentId) => {
  return makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/tasks/${taskId}/comments/${commentId}`,
    method: METHODS.DELETE,
    mockResponse: MOCKED_DELETE_COMMENT_RESPONSE,
    useAuthentication: true,
  });
};
