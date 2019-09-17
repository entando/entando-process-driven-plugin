package org.entando.plugins.pda.controller;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.Task;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.request.PagedListRequest;
import org.entando.web.response.PagedRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Tasks")
@RequestMapping(path = "/connections/{connId}/tasks")
@RequiredArgsConstructor
public class TasksController {

    private final @NonNull ConnectionService connectionService;

    private final @NonNull EngineFactory engineFactory;

    @Secured(TASK_LIST)
    @ApiOperation(notes = "Lists all tasks", nickname = "listTasks", value = "LIST Task")
    @GetMapping(produces = { APPLICATION_JSON_VALUE })
    public PagedRestResponse<Task> list(@PathVariable final String connId, final PagedListRequest restListRequest) {
        log.info("Listing tasks {}", restListRequest);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return engine.getTaskService().list(connection, restListRequest);
    }

}
