package org.entando.plugins.pda.controller.group;

import static org.entando.plugins.pda.controller.AuthPermissions.GROUP_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.ws.rs.QueryParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.response.SimpleRestResponse;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.service.ConnectionService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Groups")
@RequestMapping(path = "/connections/{connId}/groups")
@RequiredArgsConstructor
@SuppressWarnings("PMD.CloseResource")
public class GroupController {

    private final ConnectionService connectionService;

    private final EngineFactory engineFactory;

    @Secured(GROUP_LIST)
    @ApiOperation(notes = "Lists BPM groups", nickname = "listGroups", value = "LIST Group")
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<String>> listGroups(@PathVariable String connId,
            @QueryParam("processId") String processId) {
        Connection connection = connectionService.get(connId);
        Engine engine = engineFactory.getEngine(connection.getEngine());
        return new SimpleRestResponse<>(engine.getGroupService().list(connection, processId));
    }
}
