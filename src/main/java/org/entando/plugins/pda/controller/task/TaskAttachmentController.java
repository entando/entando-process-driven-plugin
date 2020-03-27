package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ATTACHMENTS_CREATE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ATTACHMENTS_DELETE;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ATTACHMENTS_DOWNLOAD;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ATTACHMENTS_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.TASK_ATTACHMENTS_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.Attachment;
import org.entando.plugins.pda.core.model.File;
import org.entando.plugins.pda.core.request.CreateAttachmentRequest;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "TaskAttachment")
@RequestMapping(path = "/connections/{connId}/tasks/{taskId}/attachments")
@RequiredArgsConstructor
public class TaskAttachmentController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(TASK_ATTACHMENTS_LIST)
    @ApiOperation(notes = "Lists a task's attachments", nickname = "listTaskAttachments",
            value = "LIST Task Attachment")
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<Attachment>> listTaskAttachments(@PathVariable final String connId,
            @PathVariable final String taskId, AuthenticatedUser user) {
        log.debug("Listing task attachments {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskAttachmentService()
                .list(connection, user, taskId));
    }

    @Secured(TASK_ATTACHMENTS_CREATE)
    @ApiOperation(notes = "Creates a task attachment", nickname = "createTaskAttachment",
            value = "CREATE Task Attachment")
    @PostMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Attachment> createTaskAttachment(@PathVariable final String connId,
            @PathVariable final String taskId, @RequestBody final CreateAttachmentRequest request,
            AuthenticatedUser user) {
        log.debug("Creating a new attachment for task {}", taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskAttachmentService()
                .create(connection, user, taskId, request));
    }

    @Secured(TASK_ATTACHMENTS_GET)
    @ApiOperation(notes = "Gets a task attachment", nickname = "getTaskAttachment", value = "GET Task Attachment")
    @GetMapping(value = "/{attachmentId}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Attachment> getTaskAttachment(@PathVariable final String connId,
            @PathVariable final String taskId, @PathVariable final String attachmentId, AuthenticatedUser user) {
        log.debug("Retrieving attachment {} from task {}", attachmentId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskAttachmentService()
                .get(connection, user, taskId, attachmentId));
    }

    @Secured(TASK_ATTACHMENTS_DELETE)
    @ApiOperation(notes = "Deletes a task attachment", nickname = "deleteTaskAttachment",
            value = "DELETE Task Attachment")
    @DeleteMapping(value = "/{attachmentId}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<String> deleteTaskAttachment(@PathVariable final String connId,
            @PathVariable final String taskId, @PathVariable final String attachmentId, AuthenticatedUser user) {
        log.debug("Deleting attachment {} from task {}", attachmentId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskAttachmentService()
                .delete(connection, user, taskId, attachmentId));
    }

    @Secured(TASK_ATTACHMENTS_DOWNLOAD)
    @ApiOperation(notes = "Returns the file of a task attachment", nickname = "downloadTaskAttachment",
            value = "DOWNLOAD Task Attachment")
    @GetMapping(value = "/{attachmentId}/download", produces = APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody byte[] downloadTaskAttachment(@PathVariable final String connId,
            @PathVariable final String taskId, @PathVariable final String attachmentId, AuthenticatedUser user,
            HttpServletResponse response) {
        log.debug("Returning attachment file {} from task {}", attachmentId, taskId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        File file = engine.getTaskAttachmentService()
                .download(connection, user, taskId, attachmentId);

        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        return file.getData();
    }
}
