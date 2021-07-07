package org.entando.plugins.pda.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang.RandomStringUtils;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.service.ConnectionConfigConnector;

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
                .url(RandomStringUtils.randomAlphabetic(10))
                .name(RandomStringUtils.randomAlphabetic(10))
                .password(RandomStringUtils.randomAlphabetic(10))
                .username(RandomStringUtils.randomAlphabetic(10))
                .build();
    }

    public ConnectionConfig generateConnectionConfig() {
        ConnectionConfig connectionConfig = ConnectionConfig.builder()
                .name(RandomStringUtils.randomAlphanumeric(30))
                .properties(new HashMap<>())
                .build();
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, RandomStringUtils.randomAlphabetic(30));
        connectionConfig.getProperties().put(ConnectionConfigMapper.USERNAME, RandomStringUtils.randomAlphabetic(30));
        connectionConfig.getProperties().put(ConnectionConfigMapper.ENGINE, FakeEngine.TYPE);
        connectionConfig.getProperties().put(ConnectionConfigMapper.URL, RandomStringUtils.randomAlphabetic(10));
        connectionConfig.getProperties()
                .put(ConnectionConfigMapper.CONNECTION_TIMEOUT, RandomStringUtils.randomNumeric(5));
        return connectionConfig;
    }
}
