package org.entando.plugins.pda.controller;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_DEFINITION_FORM;
import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_DEFINITION_LIST;
import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_DIAGRAM;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.ProcessDefinition;
import org.entando.plugins.pda.core.model.form.Form;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Process")
@RequestMapping(path = "/connections/{connId}/processes")
@RequiredArgsConstructor
public class ProcessFormController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(PROCESS_DEFINITION_FORM)
    @ApiOperation(notes = "Get process form metadata", nickname = "getProcessForm", value = "GET ProcessForm")
    @GetMapping(path = "/definitions/{id}/form", produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<List<Form>> getProcessForm(@PathVariable String connId,
            @PathVariable String id) {
        log.info("Retrieving a process form definitions for connection {} and processId {}", connId, id);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(
                engine.getProcessFormService().getProcessForm(connection, id));
    }
}
