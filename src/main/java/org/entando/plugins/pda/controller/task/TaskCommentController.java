package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMMENTS_CREATE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMMENTS_DELETE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMMENTS_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_COMMENTS_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.Comment;
import org.entando.plugins.pda.core.response.SimpleRestResponse;
import org.entando.plugins.pda.core.service.task.request.CreateCommentRequest;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "TaskComment")
@RequestMapping(path = "/connections/{connId}/tasks/{taskId}/comments")
@RequiredArgsConstructor
@SuppressWarnings("PMD.CloseResource")
public class TaskCommentController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(TASK_COMMENTS_LIST)
    @ApiOperation(notes = "Lists a task's comments", nickname = "listTaskComments", value = "LIST Task Comment")
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<Comment>> listTaskComments(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Retrieving comments from task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskCommentService()
                .list(connection, user, taskId));
    }

    @Secured(TASK_COMMENTS_CREATE)
    @ApiOperation(notes = "Creates a task comment", nickname = "createTaskComment", value = "CREATE Task Comment")
    @PostMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Comment> createTaskComment(@PathVariable final String connId,
            @PathVariable final String taskId, @RequestBody final CreateCommentRequest request,
            AuthenticatedUser user) {
        log.debug("Creating a new comment for task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskCommentService()
                .create(connection, user, taskId, request));
    }

    @Secured(TASK_COMMENTS_GET)
    @ApiOperation(notes = "Gets a task comment", nickname = "getTaskComment", value = "GET Task Comment")
    @GetMapping(value = "/{commentId}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Comment> getTaskComment(@PathVariable final String connId,
            @PathVariable final String taskId, @PathVariable final String commentId, AuthenticatedUser user) {
        log.debug("Retrieving comment {} from task {}", commentId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskCommentService()
                .get(connection, user, taskId, commentId));
    }

    @Secured(TASK_COMMENTS_DELETE)
    @ApiOperation(notes = "Deletes a task comment", nickname = "deleteTaskComment", value = "DELETE Task Comment")
    @DeleteMapping(value = "/{commentId}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<String> deleteTaskComment(@PathVariable final String connId,
            @PathVariable final String taskId, @PathVariable final String commentId, AuthenticatedUser user) {
        log.debug("Deleting comment {} from task {}", commentId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskCommentService()
                .delete(connection, user, taskId, commentId));
    }
}
