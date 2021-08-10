package org.entando.plugins.pda.service;

import java.util.List;
import org.entando.plugins.pda.model.ConnectionConfig;

public interface ConnectionConfigConnector {

    ConnectionConfig getConnectionConfig(String configName);

    List<ConnectionConfig> getConnectionConfigs();

    ConnectionConfig addConnectionConfig(ConnectionConfig connectionConfig);

    void deleteConnectionConfig(String configName);

    ConnectionConfig editConnectionConfig(ConnectionConfig connectionConfig);
}
