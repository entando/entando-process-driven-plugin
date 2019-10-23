package org.entando.plugins.pda.service;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.connectionconfigconnector.service.ConnectionConfigConnector;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ConnectionService {

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

    public Connection edit(String id, ConnectionDto request) {
        Connection connection = fromConnectionDto(request);
        connectionConfigConnector.editConnectionConfig(ConnectionConfigMapper.fromConnection(connection));
        return connection;
    }

    public Connection create(ConnectionDto request) {
        Connection connection = fromConnectionDto(request);
        connectionConfigConnector.addConnectionConfig(ConnectionConfigMapper.fromConnection(connection));
        return connection;
    }

    private Connection fromConnectionDto(ConnectionDto request) {
        engineFactory.validateEngine(request.getEngine());
        return ConnectionConfigMapper.fromDto(request);
    }
}
