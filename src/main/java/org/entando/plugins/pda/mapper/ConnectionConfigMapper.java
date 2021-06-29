package org.entando.plugins.pda.mapper;

import java.util.HashMap;
import lombok.experimental.UtilityClass;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.model.ConnectionConfig;

@UtilityClass
public class ConnectionConfigMapper {

    public static final String ENGINE = "engine";
    public static final String URL = "url";
    public static final String CONNECTION_TIMEOUT = "connectionTimeout";
    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";

    public ConnectionConfig fromConnection(Connection connection) {
        ConnectionConfig connectionConfig = ConnectionConfig.builder()
                .name(connection.getName())
                .properties(new HashMap<>())
                .build();
        connectionConfig.getProperties().put(ENGINE, connection.getEngine());
        connectionConfig.getProperties().put(URL, connection.getUrl());
        connectionConfig.getProperties().put(CONNECTION_TIMEOUT, String.valueOf(connection.getConnectionTimeout()));
        connectionConfig.getProperties().put(USERNAME, connection.getUsername());
        connectionConfig.getProperties().put(PASSWORD, connection.getPassword());
        return connectionConfig;
    }

    public Connection fromConnectionConfig(ConnectionConfig connectionConfig) {
        return Connection.builder()
                .name(connectionConfig.getName())
                .username(connectionConfig.getProperties().get(USERNAME))
                .password(connectionConfig.getProperties().get(PASSWORD))
                .engine(connectionConfig.getProperties().get(ENGINE))
                .url(connectionConfig.getProperties().get(URL))
                .connectionTimeout(Integer.valueOf(connectionConfig.getProperties().get(CONNECTION_TIMEOUT)))
                .build();
    }

    public Connection fromDto(ConnectionDto dto) {
        return Connection.builder()
                .name(dto.getName())
                .url(dto.getUrl())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .connectionTimeout(dto.getConnectionTimeout())
                .engine(dto.getEngine())
                .properties(dto.getProperties())
                .build();
    }
}
