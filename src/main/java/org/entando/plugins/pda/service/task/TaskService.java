package org.entando.plugins.pda.service.task;

import org.entando.plugins.pda.dto.task.TaskDto;
import org.entando.plugins.pda.engine.Connection;
import org.entando.web.request.PagedListRequest;
import org.entando.web.response.PagedRestResponse;

public interface TaskService {
    PagedRestResponse<TaskDto> list(Connection connection, PagedListRequest restListRequest);
}
