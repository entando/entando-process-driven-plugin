package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ASSIGN;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_CLAIM;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMPLETE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_PAUSE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_RESUME;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_START;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_UNCLAIM;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.Task;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "TaskLifecycle")
@RequestMapping(path = "/connections/{connId}/tasks/{taskId}")
@RequiredArgsConstructor
public class TaskLifecycleController {

    private final ConnectionService connectionService;
    private final EngineFactory engineFactory;

    @Secured(TASK_CLAIM)
    @ApiOperation(notes = "Claim task", nickname = "claimTask", value = "Claim task")
    @PutMapping(value = "/claim", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> claimTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Claim task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().claim(connection, user, taskId));
    }

    @Secured(TASK_UNCLAIM)
    @ApiOperation(notes = "Unclaim task", nickname = "unclaimTask", value = "Unclaim task")
    @PutMapping(value = "/unclaim", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> unclaimTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Unclaim task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().unclaim(connection, user, taskId));
    }

    @Secured(TASK_ASSIGN)
    @ApiOperation(notes = "Assign task", nickname = "assignTask", value = "Assign task")
    @PutMapping(value = "/assign/{assignee}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> assignTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user, @PathVariable String assignee) {
        log.debug("Assign task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().assign(connection, user, taskId, assignee));
    }

    @Secured(TASK_START)
    @ApiOperation(notes = "Start task", nickname = "startTask", value = "Start task")
    @PutMapping(value = "/start", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> startTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Start task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().start(connection, user, taskId));
    }

    @Secured(TASK_PAUSE)
    @ApiOperation(notes = "Pause task", nickname = "pauseTask", value = "Pause task")
    @PutMapping(value = "/pause", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> pauseTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Pause task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().pause(connection, user, taskId));
    }

    @Secured(TASK_RESUME)
    @ApiOperation(notes = "Resume task", nickname = "resumeTask", value = "Resume task")
    @PutMapping(value = "/resume", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> resumeTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Resume task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().resume(connection, user, taskId));
    }

    @Secured(TASK_COMPLETE)
    @ApiOperation(notes = "Complete task", nickname = "completeTask", value = "Complete task")
    @PutMapping(value = "/complete", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Task> completeTask(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Complete task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleService().complete(connection, user, taskId));
    }
}
