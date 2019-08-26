package org.entando.plugins.pda.service.task.impl;

import org.entando.plugins.pda.dto.task.TaskDto;
import org.entando.plugins.pda.engine.Connection;
import org.entando.plugins.pda.service.task.TaskService;
import org.entando.web.request.PagedListRequest;
import org.entando.web.response.PagedMetadata;
import org.entando.web.response.PagedRestResponse;
import org.springframework.stereotype.Service;

@Service
public class FakeTaskService implements TaskService {

    @Override
    public PagedRestResponse<TaskDto> list(Connection connection, PagedListRequest request) {
        return new PagedRestResponse<>(new PagedMetadata<>(request, 0));
    }

}
