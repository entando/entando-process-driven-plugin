package org.entando.plugins.pda.controller;

import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.Process;
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
@Api(tags = "Process")
@RequestMapping(path = "/connections/{connId}/process/")
@RequiredArgsConstructor
public class ProcessController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(PROCESS_LIST)
    @ApiOperation(notes = "Lists all processes", nickname = "listProcess", value = "LIST Process")
    @GetMapping(produces = {APPLICATION_JSON_VALUE})
    public PagedRestResponse<Process> list(@PathVariable final String connId, final AuthenticatedUser user,
            final PagedListRequest restListRequest) {
        log.info("Listing processes {}", restListRequest);
        Connection connection = connectionService.get(connId);// NO PMD
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return engine.getProcessService().list(connection, user, restListRequest);
    }
}
