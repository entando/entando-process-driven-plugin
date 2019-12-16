package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.controller.AuthPermissions.TASK_DEFINITION_COLUMNS_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.keycloak.security.AuthenticatedUser;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
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
@Api(tags = "TaskDefinition")
@RequestMapping(path = "/connections/{connId}/tasks")
@RequiredArgsConstructor
public class TaskDefinitionController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(TASK_DEFINITION_COLUMNS_LIST)
    @ApiOperation(notes = "Lists task columns", nickname = "listTaskColumns", value = "LIST Task Columns")
    @GetMapping(value = "/columns", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Set<String>> listTaskColumns(@PathVariable final String connId, AuthenticatedUser user) {
        log.debug("Listing task columns");
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getTaskDefinitionService()
                .listColumns(connection, user));
    }
}
