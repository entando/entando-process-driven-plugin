package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_FORM;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.serializer.JsonSchemaForm;
import org.entando.plugins.pda.serializer.V7JsonSchemaForm;
import org.entando.plugins.pda.service.ConnectionService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Task")
@RequestMapping(path = "/connections/{connId}/tasks/{taskId}/form")
@RequiredArgsConstructor
public class TaskFormController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(TASK_FORM)
    @ApiOperation(notes = "Get task form metadata", nickname = "getTaskForm", value = "GET TaskForm")
    @GetMapping(produces = {APPLICATION_JSON_VALUE})
    public JsonSchemaForm getTaskForm(@PathVariable String connId, @PathVariable String taskId) {
        log.info("Retrieving a task form definition for connection {} and taskId {}", connId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new V7JsonSchemaForm(
                engine.getTaskFormService().getTaskForm(connection, taskId));
    }
}
