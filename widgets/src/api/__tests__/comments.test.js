import { getTaskComments, postTaskComment, deleteTaskComment } from 'api/pda/comments';
import { DOMAINS } from 'api/constants';

import MOCKED_GET_TASK_COMMENTS_RESPONSE from 'mocks/taskComments/getComments';
import MOCKED_POST_COMMENT_RESPONSE from 'mocks/taskComments/postComment';
import MOCKED_DELETE_COMMENT_RESPONSE from 'mocks/taskComments/deleteComment';

describe('Task comments API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getTaskComments to return expected data', async () => {
    const connection = 'kieStaging';
    const taskId = 32;
    const url = `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/comments`;

    fetch.mockResponseOnce(JSON.stringify(MOCKED_GET_TASK_COMMENTS_RESPONSE.WITH_COMMENTS));
    const result = await getTaskComments(connection, taskId);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(MOCKED_GET_TASK_COMMENTS_RESPONSE.WITH_COMMENTS);
  });

  it('postTaskComment to return expected data', async () => {
    const connection = 'kieStaging';
    const taskId = 32;
    const body = JSON.stringify({ comment: 'Comment text' });
    const { comment } = JSON.parse(body);
    fetch.mockResponseOnce(JSON.stringify(MOCKED_POST_COMMENT_RESPONSE));
    const result = await postTaskComment(connection, taskId, comment);

    expect(fetch.mock.calls.length).toBe(1);

    expect(fetch.mock.calls[0][1].method).toEqual('POST');
    expect(fetch.mock.calls[0][1].body).toEqual(body);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/comments`
    );
    expect(result).toEqual(MOCKED_POST_COMMENT_RESPONSE);
  });

  it('deleteTaskComment to return expected data', async () => {
    const connection = 'kieStaging';
    const taskId = 32;
    const commentId = MOCKED_DELETE_COMMENT_RESPONSE.payload;

    fetch.mockResponseOnce(JSON.stringify(MOCKED_DELETE_COMMENT_RESPONSE));
    const result = await deleteTaskComment(connection, taskId, commentId);

    expect(fetch.mock.calls.length).toBe(1);

    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/comments/${commentId}`
    );
    expect(result).toEqual(MOCKED_DELETE_COMMENT_RESPONSE);
  });
});
