package org.entando.plugins.pda.service;

import static org.entando.web.request.PagedListRequest.DIRECTION_VALUE_DEFAULT;
import static org.entando.web.request.PagedListRequest.SORT_VALUE_DEFAULT;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.connectionconfigconnector.service.ConnectionConfigConnector;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.web.exception.BadRequestException;
import org.entando.web.request.PagedListRequest;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ConnectionService {

    public static final String OK = "OK";
    public static final String REQUIRED_MESSAGE_KEY = "org.entando.error.connection.required";
    private final EngineFactory engineFactory;
    private final ConnectionConfigConnector connectionConfigConnector;

    public ConnectionService(EngineFactory engineFactory, ConnectionConfigConnector connectionConfigConnector) {
        this.engineFactory = engineFactory;
        this.connectionConfigConnector = connectionConfigConnector;
    }

    public List<Connection> list() {
        return connectionConfigConnector.getConnectionConfigs().stream()
                .map(ConnectionConfigMapper::fromConnectionConfig)
                .collect(Collectors.toList());
    }

    public Connection get(String id) {
        ConnectionConfig connectionConfig = connectionConfigConnector.getConnectionConfig(id);
        return ConnectionConfigMapper.fromConnectionConfig(connectionConfig);
    }

    public void delete(String id) {
        connectionConfigConnector.deleteConnectionConfig(id);
    }

    public Connection edit(ConnectionDto request) {
        Connection connection = fromConnectionDto(request);
        connectionConfigConnector.editConnectionConfig(ConnectionConfigMapper.fromConnection(connection));
        return connection;
    }

    public Connection create(ConnectionDto request) {
        Connection connection = fromConnectionDto(request);
        if (connection.getConnectionTimeout() == null) {
            throw new BadRequestException(REQUIRED_MESSAGE_KEY);
        }
        connectionConfigConnector.addConnectionConfig(ConnectionConfigMapper.fromConnection(connection));
        return connection;
    }

    public String test(String id) {
        ConnectionConfig connectionConfig = connectionConfigConnector.getConnectionConfig(id);
        Connection connection = ConnectionConfigMapper.fromConnectionConfig(connectionConfig);
        Engine engine = engineFactory.getEngine(connection.getEngine());

        PagedListRequest pageRequest = new PagedListRequest(1, 1,
                SORT_VALUE_DEFAULT, DIRECTION_VALUE_DEFAULT);

        engine.getTaskService().list(connection, null, pageRequest, null, null);
        return OK;
    }

    private Connection fromConnectionDto(ConnectionDto request) {
        engineFactory.validateEngine(request.getEngine());
        return ConnectionConfigMapper.fromDto(request);
    }
}
