package org.entando.plugins.pda.util;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.experimental.UtilityClass;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;

@UtilityClass
public class ConnectionTestHelper {
    public static final String CONNECTION_NAME_1 = "production";
    public static final String CONNECTION_HOST_1 = "myurl";
    public static final String CONNECTION_PORT_1 = "80";
    public static final String CONNECTION_SCHEMA_1 = "https";
    public static final Integer CONNECTION_TIMEOUT_1 = 60000;
    public static final String CONNECTION_ENGINE_1 = "fake";
    public static final String CONNECTION_USERNAME_1 = "pam";
    public static final String CONNECTION_PASSWORD_1 = "productionPassword";

    public static final String CONNECTION_NAME_2 = "staging";
    public static final String CONNECTION_HOST_2 = "localhost";
    public static final String CONNECTION_PORT_2 = "8080";
    public static final String CONNECTION_SCHEMA_2 = "http";
    public static final Integer CONNECTION_TIMEOUT_2 = 30000;
    public static final String CONNECTION_ENGINE_2 = "fake";
    public static final String CONNECTION_USERNAME_2 = "pam";
    public static final String CONNECTION_PASSWORD_2 = "stagingPassword";

    public static final String CONNECTION_NAME_3 = "newConn";
    public static final String CONNECTION_HOST_3 = "myhost";
    public static final String CONNECTION_PORT_3 = "8081";
    public static final String CONNECTION_SCHEMA_3 = "https";
    public static final Integer CONNECTION_TIMEOUT_3 = 45000;
    public static final String CONNECTION_ENGINE_3 = "fakeEngine";
    public static final String CONNECTION_USERNAME_3 = "editedusername";
    public static final String CONNECTION_PASSWORD_3 = "editedpassword";

    public List<Connection> createConnections() {
        List<Connection> result = new ArrayList<>();

        result.add(Connection.builder()
                .name(CONNECTION_NAME_1)
                .host(CONNECTION_HOST_1)
                .port(CONNECTION_PORT_1)
                .schema(CONNECTION_SCHEMA_1)
                .connectionTimeout(CONNECTION_TIMEOUT_1)
                .engine(CONNECTION_ENGINE_1)
                .username(CONNECTION_USERNAME_1)
                .password(CONNECTION_PASSWORD_1)
                .build());

        result.add(Connection.builder()
                .name(CONNECTION_NAME_2)
                .host(CONNECTION_HOST_2)
                .port(CONNECTION_PORT_2)
                .schema(CONNECTION_SCHEMA_2)
                .connectionTimeout(CONNECTION_TIMEOUT_2)
                .engine(CONNECTION_ENGINE_2)
                .username(CONNECTION_USERNAME_2)
                .password(CONNECTION_PASSWORD_2)
                .build());

        return result;
    }

    public Connection createConnection() {
        return Connection.builder()
                .name(CONNECTION_NAME_3)
                .host(CONNECTION_HOST_3)
                .port(CONNECTION_PORT_3)
                .schema(CONNECTION_SCHEMA_3)
                .connectionTimeout(CONNECTION_TIMEOUT_3)
                .engine(CONNECTION_ENGINE_3)
                .username(CONNECTION_USERNAME_3)
                .password(CONNECTION_PASSWORD_3)
                .build();
    }

    public Map<String, ConnectionDto> createConnectionsDto() {
        return createConnections().stream()
            .map(c -> new AbstractMap.SimpleEntry<>(c.getName(), ConnectionDto.fromModel(c)))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public ConnectionDto createConnectionDto() {
        return ConnectionDto.fromModel(createConnection());
    }
}
