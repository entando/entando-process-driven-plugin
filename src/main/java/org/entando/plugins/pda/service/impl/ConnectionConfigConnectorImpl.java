package org.entando.plugins.pda.service.impl;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.exception.ConnectionAlreadyExistsException;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.exception.InvalidStrictOperationException;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.model.SecurityLevel;
import org.entando.plugins.pda.service.ConnectionConfigConnector;
import org.entando.plugins.pda.service.ConnectionConfigService;
import org.entando.web.exception.InternalServerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException.Conflict;
import org.springframework.web.client.HttpClientErrorException.NotFound;
import org.springframework.web.client.HttpServerErrorException;


@Slf4j
@Service
public class ConnectionConfigConnectorImpl implements ConnectionConfigConnector {

    private final SecurityLevel securityLevel;

    private final ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem;

    private final ConnectionConfigService connectionConfigService;

    public static final String INTERNAL_ERROR_KEY = "org.entando.error.internalServerError";

    public ConnectionConfigConnectorImpl(
            @Value("${entando.plugin.security.level:STRICT}") String securityLevel,
            ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem,
            ConnectionConfigService connectionConfigService) {
        this.securityLevel = SecurityLevel.valueOf(securityLevel);
        this.connectionConfigConnectorFileSystem = connectionConfigConnectorFileSystem;
        this.connectionConfigService = connectionConfigService;
    }

    @Override
    @SuppressFBWarnings("OBL_UNSATISFIED_OBLIGATION")
    public ConnectionConfig getConnectionConfig(String configName) {
        if (securityLevel == SecurityLevel.STRICT) {
            return connectionConfigConnectorFileSystem.getConnectionConfig(configName);
        } else {
            return connectionConfigService.getConnectionConfig(configName);
        }
    }

    @Override
    public List<ConnectionConfig> getConnectionConfigs() {
        if (securityLevel == SecurityLevel.STRICT) {
            return connectionConfigConnectorFileSystem.getConnectionConfigs();
        } else {
            return connectionConfigService.getAllConnectionConfig();
        }
    }

    @Override
    public ConnectionConfig addConnectionConfig(ConnectionConfig connectionConfig) {
        if (securityLevel == SecurityLevel.STRICT) {
            throw new InvalidStrictOperationException();
        }
        try {
            connectionConfigService.addConnectionConfig(connectionConfig);
            return connectionConfig;
        } catch (Conflict e) {
            log.trace("Connection already exists: {}", connectionConfig.getName());
            throw new ConnectionAlreadyExistsException(e);
        } catch (HttpServerErrorException e) {
            log.error("Error adding connection config {}!", connectionConfig.getName(), e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }

    @Override
    public void deleteConnectionConfig(String configName) {
        if (securityLevel == SecurityLevel.STRICT) {
            throw new InvalidStrictOperationException();
        }
        try {
            connectionConfigService.removeConnectionConfig(configName);
        } catch (NotFound e) {
            log.trace("Connection not found: {}", configName);
            throw new ConnectionNotFoundException(e);
        } catch (HttpServerErrorException e) {
            log.error("Error deleting connection config {}!", configName, e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }

    @Override
    public ConnectionConfig editConnectionConfig(ConnectionConfig connectionConfig) {
        if (securityLevel == SecurityLevel.STRICT) {
            throw new InvalidStrictOperationException();
        }
        try {
            return connectionConfigService.editConnectionConfig(connectionConfig);
        } catch (NotFound e) {
            log.trace("Connection not found: {}", connectionConfig.getName());
            throw new ConnectionNotFoundException(e);
        } catch (HttpServerErrorException e) {
            log.error("Error editing connection config {}!", connectionConfig.getName(), e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }
}
