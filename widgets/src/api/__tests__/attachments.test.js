import { getAttachments, saveAttachment, deleteAttachment } from 'api/pda/attachments';
import { DOMAINS } from 'api/constants';

import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import MOCKED_ATTACHMENTS_RESPONSE from 'mocks/pda/attachments';

describe('Attachments API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('getAttachments to return expected data', async () => {
    const connection = 'kieStaging';
    const { taskId } = WIDGETS_CONFIG.ATTACHMENTS;
    const url = `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/attachments`;

    fetch.mockResponseOnce(JSON.stringify(MOCKED_ATTACHMENTS_RESPONSE));
    const result = await getAttachments(connection, taskId);

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][1].method).toEqual('GET');
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(result).toEqual(MOCKED_ATTACHMENTS_RESPONSE);
  });

  it('saveAttachment to return expected data', async () => {
    const connection = 'kieStaging';
    const { taskId } = WIDGETS_CONFIG.ATTACHMENTS;
    const file = new File([''], 'test.txt', { type: 'text/plain' });

    fetch.mockResponseOnce(JSON.stringify({}));
    const result = await saveAttachment(connection, taskId, file);

    expect(fetch.mock.calls.length).toBe(1);

    expect(fetch.mock.calls[0][1].method).toEqual('POST');
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/attachments`
    );
    expect(result).toEqual({});
  });

  it('deleteAttachment to return expected data', async () => {
    const connection = 'kieStaging';
    const { taskId } = WIDGETS_CONFIG.ATTACHMENTS;
    const attachmentId = MOCKED_ATTACHMENTS_RESPONSE.payload[0].id;

    fetch.mockResponseOnce(JSON.stringify({}));
    const result = await deleteAttachment(connection, taskId, attachmentId);

    expect(fetch.mock.calls.length).toBe(1);

    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
    expect(fetch.mock.calls[0][0]).toEqual(
      `${DOMAINS.PDA}/connections/${connection}/tasks/${taskId}/attachments/${attachmentId}`
    );
    expect(result).toEqual({});
  });
});
