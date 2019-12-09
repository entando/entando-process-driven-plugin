package org.entando.plugins.pda.controller;

import static java.nio.charset.StandardCharsets.UTF_8;
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
public class ProcessController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(PROCESS_DEFINITION_LIST)
    @ApiOperation(notes = "Lists all processes definitions", nickname = "listProcessDefinitions",
            value = "LIST ProcessDefinition")
    @GetMapping(path = "/definitions", produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<List<ProcessDefinition>> listDefinitions(@PathVariable final String connId) {
        log.info("Listing processes definitions for connection {}", connId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(
                engine.getProcessService().listDefinitions(connection));
    }

    @Secured(PROCESS_DIAGRAM)
    @ApiOperation(notes = "Gets the process diagram", nickname = "getProcessDiagram",
            value = "GET Process Diagram")
    @GetMapping(path = "/{id}/diagram", produces = {"application/svg+xml"})
    public byte[] getProcessDiagram(@PathVariable final String connId,
            @PathVariable final String id) {
        log.info("Retrieving process diagram for {}", id);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return engine.getProcessService().getProcessDiagram(connection, id)
                .getBytes(UTF_8);
    }
}
