package org.entando.plugins.pda.controller;

import static org.entando.plugins.pda.controller.AuthPermissions.CONNECTION_CREATE;
import static org.entando.plugins.pda.controller.AuthPermissions.CONNECTION_DELETE;
import static org.entando.plugins.pda.controller.AuthPermissions.CONNECTION_EDIT;
import static org.entando.plugins.pda.controller.AuthPermissions.CONNECTION_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.CONNECTION_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Connections")
@RequestMapping(path = "/connections")
@RequiredArgsConstructor
public class ConnectionsController {

    private final ConnectionService connectionService;

    @Secured(CONNECTION_LIST)
    @ApiOperation(notes = "Lists all connections", nickname = "listConnections", value = "LIST Connection")
    @GetMapping(produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<List<ConnectionDto>> list() {
        log.info("Listing connections");
        return new SimpleRestResponse<>(
                connectionService.list().stream()
                        .map(ConnectionDto::fromModel)
                        .collect(Collectors.toList()));
    }

    @Secured(CONNECTION_GET)
    @ApiOperation(notes = "Gets a connection", nickname = "getConnection", value = "GET Connection")
    @GetMapping(path = "/{connId}", produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<ConnectionDto> get(@PathVariable String connId) {
        log.info("Requesting connection {}", connId);
        return new SimpleRestResponse<>(
                ConnectionDto.fromModel(connectionService.get(connId)));
    }

    @Secured(CONNECTION_DELETE)
    @ApiOperation(notes = "Deletes a connection", nickname = "deleteConnection", value = "DELETE Connection")
    @DeleteMapping(path = "/{connId}", produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<Void> delete(@PathVariable String connId) {
        log.info("Deleting connection {}", connId);
        connectionService.delete(connId);
        return new SimpleRestResponse<>();
    }

    @Secured(CONNECTION_EDIT)
    @ApiOperation(notes = "Edits a connection", nickname = "editConnection", value = "EDIT Connection")
    @PutMapping(path = "/{connId}", produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<ConnectionDto> edit(@PathVariable String connId, @RequestBody ConnectionDto request) {
        log.info("Editing connection {}", connId);
        return new SimpleRestResponse<>(
                ConnectionDto.fromModel(connectionService.edit(connId, request)));
    }

    @Secured(CONNECTION_CREATE)
    @ApiOperation(notes = "Creates a connection", nickname = "createConnection", value = "CREATE Connection")
    @PostMapping(produces = {APPLICATION_JSON_VALUE})
    public SimpleRestResponse<ConnectionDto> create(@RequestBody ConnectionDto request) {
        log.info("Creating connection {}", request);
        return new SimpleRestResponse<>(
                ConnectionDto.fromModel(connectionService.create(request)));
    }
}
