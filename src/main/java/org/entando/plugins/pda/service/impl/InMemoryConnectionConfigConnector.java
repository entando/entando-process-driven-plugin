package org.entando.plugins.pda.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.entando.plugins.pda.exception.ConnectionAlreadyExistsException;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.service.ConnectionConfigConnector;

public class InMemoryConnectionConfigConnector implements ConnectionConfigConnector {

    private final Map<String, ConnectionConfig> connectionConfigMap = new ConcurrentHashMap<>();

    @Override
    public ConnectionConfig getConnectionConfig(String configName) {
        ConnectionConfig connectionConfig = connectionConfigMap.get(configName);
        if (connectionConfig == null) {
            throw new ConnectionNotFoundException();
        }
        return connectionConfig;
    }

    @Override
    public List<ConnectionConfig> getConnectionConfigs() {
        return new ArrayList<>(connectionConfigMap.values());
    }

    @Override
    public ConnectionConfig addConnectionConfig(ConnectionConfig connectionConfig) {
        ConnectionConfig retrieved = connectionConfigMap.get(connectionConfig.getName());
        if (retrieved != null) {
            throw new ConnectionAlreadyExistsException();
        }
        return connectionConfigMap.put(connectionConfig.getName(), connectionConfig);
    }

    @Override
    public void deleteConnectionConfig(String configName) {
        ConnectionConfig retrieved = connectionConfigMap.get(configName);
        if (retrieved == null) {
            throw new ConnectionNotFoundException();
        }
        connectionConfigMap.remove(configName);
    }

    @Override
    public ConnectionConfig editConnectionConfig(ConnectionConfig connectionConfig) {
        ConnectionConfig retrieved = connectionConfigMap.get(connectionConfig.getName());
        if (retrieved == null) {
            throw new ConnectionNotFoundException();
        }
        return connectionConfigMap.put(connectionConfig.getName(), connectionConfig);
    }
}
