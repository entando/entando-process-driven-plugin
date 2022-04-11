package org.entando.plugins.pda.controller.process;

import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_DEFINITION_FORM_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_DEFINITION_FORM_SUBMIT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.response.SimpleRestResponse;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.serializer.JsonSchemaForm;
import org.entando.plugins.pda.serializer.V7JsonSchemaForm;
import org.entando.plugins.pda.service.ConnectionService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Process")
@RequestMapping(path = "/connections/{connId}/processes/definitions/{id}/form")
@RequiredArgsConstructor
@SuppressWarnings("PMD.CloseResource")
public class ProcessFormController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(PROCESS_DEFINITION_FORM_GET)
    @ApiOperation(notes = "Get process form metadata", nickname = "getProcessForm", value = "GET ProcessForm")
    @GetMapping(produces = {APPLICATION_JSON_VALUE})
    public JsonSchemaForm getProcessForm(@PathVariable String connId, @PathVariable String id) {
        log.info("Retrieving a process form definitions for connection {} and processId {}", connId, id);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new V7JsonSchemaForm(engine.getProcessFormService().get(connection, id));
    }

    @Secured(PROCESS_DEFINITION_FORM_SUBMIT)
    @ApiOperation(notes = "Starts a new process", nickname = "submitProcessForm", value = "SUBMIT ProcessForm")
    @PostMapping(produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<String> submitProcessForm(@PathVariable String connId, @PathVariable String id,
            @RequestBody Map<String, Object> form, AuthenticatedUser user) {
        log.info("Starting a new process for connection {} and id {}", connId, id);

        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getProcessFormService().submit(connection, id, form, user));
    }
}
