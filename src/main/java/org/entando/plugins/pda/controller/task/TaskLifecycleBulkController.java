package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ASSIGN;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_CLAIM;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMPLETE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_PAUSE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_START;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_UNCLAIM;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.service.task.response.TaskBulkActionResponse;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "TaskLifecycleBulk")
@RequestMapping(path = "/connections/{connId}/bulk/tasks")
@RequiredArgsConstructor
public class TaskLifecycleBulkController {

    private final ConnectionService connectionService;
    private final EngineFactory engineFactory;

    @Secured(TASK_CLAIM)
    @ApiOperation(notes = "Bulk Claim tasks", nickname = "bulkClaimTasks", value = "Bulk claim tasks")
    @PutMapping(value = "/claim", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkClaimTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, AuthenticatedUser user) {
        log.debug("Bulk Claim tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleBulkService().bulkClaim(connection, user, ids));
    }

    @Secured(TASK_UNCLAIM)
    @ApiOperation(notes = "Bulk Unclaim tasks", nickname = "bulkUnclaimTasks", value = "Bulk unclaim tasks")
    @PutMapping(value = "/unclaim", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkUnclaimTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, AuthenticatedUser user) {
        log.debug("Bulk Unclaim tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleBulkService().bulkUnclaim(connection, user, ids));
    }

    @Secured(TASK_ASSIGN)
    @ApiOperation(notes = "Bulk Assign tasks", nickname = "bulkAssignTasks", value = "Bulk assign tasks")
    @PutMapping(value = "/assign/{assignee}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkAssignTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, @PathVariable String assignee, AuthenticatedUser user) {
        log.debug("Bulk Assign tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(
                engine.getTaskLifecycleBulkService().bulkAssign(connection, user, ids, assignee));
    }

    @Secured(TASK_START)
    @ApiOperation(notes = "Bulk Start tasks", nickname = "bulkStartTasks", value = "Bulk start tasks")
    @PutMapping(value = "/start", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkStartTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, AuthenticatedUser user) {
        log.debug("Bulk Start tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleBulkService().bulkStart(connection, user, ids));
    }

    @Secured(TASK_PAUSE)
    @ApiOperation(notes = "Bulk Pause tasks", nickname = "bulkPauseTasks", value = "Bulk pause tasks")
    @PutMapping(value = "/pause", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkPauseTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, AuthenticatedUser user) {
        log.debug("Bulk Pause tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleBulkService().bulkPause(connection, user, ids));
    }

    @Secured(TASK_COMPLETE)
    @ApiOperation(notes = "Bulk Complete tasks", nickname = "bulkCompleteTasks", value = "Bulk complete tasks")
    @PutMapping(value = "/complete", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<TaskBulkActionResponse>> bulkCompleteTask(@PathVariable final String connId,
            @RequestBody final List<String> ids, AuthenticatedUser user) {
        log.debug("Bulk Complete tasks {}", ids);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskLifecycleBulkService().bulkComplete(connection, user, ids));
    }
}
