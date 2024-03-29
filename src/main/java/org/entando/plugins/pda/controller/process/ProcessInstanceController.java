package org.entando.plugins.pda.controller.process;

import static org.entando.plugins.pda.controller.AuthPermissions.PROCESS_INSTANCE_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.model.ProcessInstance;
import org.entando.plugins.pda.core.response.SimpleRestResponse;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "ProcessInstances")
@RequestMapping(path = "/connections/{connId}/processes/instances")
@RequiredArgsConstructor
@SuppressWarnings("PMD.CloseResource")
public class ProcessInstanceController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(PROCESS_INSTANCE_LIST)
    @ApiOperation(notes = "Lists process instances", nickname = "listProcessInstances",
            value = "LIST Process instances")
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<ProcessInstance>> listProcessInstances(@PathVariable String connId,
            @RequestParam String processDefinitionId, AuthenticatedUser user) {
        log.debug("Listing processes instances for connection {}", connId);
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getProcessInstanceService().list(connection, processDefinitionId, user));
    }
}
