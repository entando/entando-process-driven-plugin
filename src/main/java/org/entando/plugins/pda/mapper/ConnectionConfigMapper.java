package org.entando.plugins.pda.mapper;

import java.util.HashMap;
import lombok.experimental.UtilityClass;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;

@UtilityClass
public class ConnectionConfigMapper {

    public static final String ENGINE_KEY = "engine";
    public static final String APP_KEY = "app";
    public static final String CONNECTION_TIMEOUT = "connectionTimeout";
    public static final String HOST = "host";
    public static final String PORT = "port";
    public static final String SCHEMA = "schema";
    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";

    public ConnectionConfig fromConnection(Connection connection) {
        ConnectionConfig connectionConfig = ConnectionConfig.builder()
                .name(connection.getName())
                .properties(new HashMap<>())
                .build();
        connectionConfig.getProperties().put(ENGINE_KEY, connection.getEngine());
        connectionConfig.getProperties().put(APP_KEY, connection.getApp());
        connectionConfig.getProperties().put(CONNECTION_TIMEOUT, String.valueOf(connection.getConnectionTimeout()));
        connectionConfig.getProperties().put(HOST, connection.getHost());
        connectionConfig.getProperties().put(PORT, connection.getPort());
        connectionConfig.getProperties().put(SCHEMA, connection.getSchema());
        connectionConfig.getProperties().put(USERNAME, connection.getUsername());
        connectionConfig.getProperties().put(PASSWORD, connection.getPassword());
        return connectionConfig;
    }

    public Connection fromConnectionConfig(ConnectionConfig connectionConfig) {
        return Connection.builder()
                .name(connectionConfig.getName())
                .username(connectionConfig.getProperties().get(USERNAME))
                .password(connectionConfig.getProperties().get(PASSWORD))
                .engine(connectionConfig.getProperties().get(ENGINE_KEY))
                .app(connectionConfig.getProperties().get(APP_KEY))
                .connectionTimeout(Integer.valueOf(connectionConfig.getProperties().get(CONNECTION_TIMEOUT)))
                .host(connectionConfig.getProperties().get(HOST))
                .port(connectionConfig.getProperties().get(PORT))
                .schema(connectionConfig.getProperties().get(SCHEMA))
                .build();
    }

    public Connection fromDto(ConnectionDto dto) {
        return Connection.builder()
                .name(dto.getName())
                .host(dto.getHost())
                .port(dto.getPort())
                .schema(dto.getSchema())
                .app(dto.getApp())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .connectionTimeout(dto.getConnectionTimeout())
                .engine(dto.getEngine())
                .properties(dto.getProperties())
                .build();
    }
}
