package org.entando.plugins.pda.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang.RandomStringUtils;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.connectionconfigconnector.service.ConnectionConfigConnector;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;

@UtilityClass
public class ConnectionTestHelper {

    public List<ConnectionConfig> generateConnectionConfigs(ConnectionConfigConnector configConnector) {
        ConnectionConfig config1 = generateConnectionConfig();
        ConnectionConfig config2 = generateConnectionConfig();
        ConnectionConfig config3 = generateConnectionConfig();
        configConnector.addConnectionConfig(config1);
        configConnector.addConnectionConfig(config2);
        configConnector.addConnectionConfig(config3);
        return Arrays.asList(config1, config2, config3);
    }

    public List<ConnectionConfig> generateConnectionConfigs() {
        ConnectionConfig config1 = generateConnectionConfig();
        ConnectionConfig config2 = generateConnectionConfig();
        ConnectionConfig config3 = generateConnectionConfig();
        return Arrays.asList(config1, config2, config3);
    }

    public ConnectionDto generateConnectionDto() {
        return ConnectionDto.builder()
                .connectionTimeout(Integer.valueOf(RandomStringUtils.randomNumeric(5)))
                .engine("fake")
                .host(RandomStringUtils.randomAlphabetic(10))
                .name(RandomStringUtils.randomAlphabetic(10))
                .password(RandomStringUtils.randomAlphabetic(10))
                .port(RandomStringUtils.randomNumeric(5))
                .schema(RandomStringUtils.randomAlphabetic(10))
                .username(RandomStringUtils.randomAlphabetic(10))
                .app(RandomStringUtils.randomAlphabetic(10))
                .build();
    }

    public ConnectionConfig generateConnectionConfig() {
        ConnectionConfig connectionConfig = ConnectionConfig.builder()
                .name(RandomStringUtils.randomAlphanumeric(30))
                .properties(new HashMap<>())
                .build();
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, RandomStringUtils.randomAlphabetic(30));
        connectionConfig.getProperties().put(ConnectionConfigMapper.USERNAME, RandomStringUtils.randomAlphabetic(30));
        connectionConfig.getProperties().put(ConnectionConfigMapper.ENGINE_KEY, "fake");
        connectionConfig.getProperties().put(ConnectionConfigMapper.APP_KEY, RandomStringUtils.randomAlphabetic(10));
        connectionConfig.getProperties()
                .put(ConnectionConfigMapper.CONNECTION_TIMEOUT, RandomStringUtils.randomNumeric(5));
        connectionConfig.getProperties().put(ConnectionConfigMapper.HOST, RandomStringUtils.randomAlphabetic(15));
        connectionConfig.getProperties().put(ConnectionConfigMapper.PORT, RandomStringUtils.randomNumeric(5));
        connectionConfig.getProperties().put(ConnectionConfigMapper.SCHEMA, RandomStringUtils.randomAlphabetic(5));
        return connectionConfig;
    }
}
