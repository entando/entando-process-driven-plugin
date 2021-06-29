package org.entando.plugins.pda.service.impl;

import static org.entando.plugins.pda.config.ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.exception.ConnectionAlreadyExistsException;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.exception.InvalidStrictOperationException;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.model.SecurityLevel;
import org.entando.plugins.pda.service.ConnectionConfigConnector;
import org.entando.web.exception.InternalServerException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpClientErrorException.Conflict;
import org.springframework.web.client.HttpClientErrorException.NotFound;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;


@Slf4j
@Service
public class ConnectionConfigConnectorImpl implements ConnectionConfigConnector {

    private static final String CONFIG_ENDPOINT = "/config";

    private final SecurityLevel securityLevel;

    private final RestTemplate restTemplate;

    private final ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem;

    public static final String INTERNAL_ERROR_KEY = "org.entando.error.internalServerError";

    public ConnectionConfigConnectorImpl(
            @Value("${entando.plugin.security.level:STRICT}") String securityLevel,
            @Qualifier(CONFIG_REST_TEMPLATE) RestTemplate restTemplate,
            ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem) {
        this.securityLevel = SecurityLevel.valueOf(securityLevel);
        this.restTemplate = restTemplate;
        this.connectionConfigConnectorFileSystem = connectionConfigConnectorFileSystem;
    }

    @Override
    @SuppressFBWarnings("OBL_UNSATISFIED_OBLIGATION")
    public ConnectionConfig getConnectionConfig(String configName) {
        if (securityLevel == SecurityLevel.STRICT) {
            return connectionConfigConnectorFileSystem.getConnectionConfig(configName);
        } else {
            return getConnectionConfigFromEndpoint(configName);
        }
    }

    private ConnectionConfig getConnectionConfigFromEndpoint(String configName) {
        try {
            ResponseEntity<ConnectionConfig> response = restTemplate
                    .getForEntity(CONFIG_ENDPOINT + "/" + configName, ConnectionConfig.class);
            return response.getBody();
        } catch (NotFound e) {
            log.trace("Connection not found: {}", configName);
            throw new ConnectionNotFoundException(e);
        } catch (HttpClientErrorException e) {
            log.debug("Error retrieving configuration with name {}", configName, e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }

    @Override
    public List<ConnectionConfig> getConnectionConfigs() {
        if (securityLevel == SecurityLevel.STRICT) {
            return connectionConfigConnectorFileSystem.getConnectionConfigs();
        } else {
            return getConnectionConfigsFromEndpoint();
        }
    }

    private List<ConnectionConfig> getConnectionConfigsFromEndpoint() {
        try {
            ResponseEntity<List<ConnectionConfig>> response = restTemplate
                    .exchange(CONFIG_ENDPOINT, HttpMethod.GET, null,
                            new ParameterizedTypeReference<List<ConnectionConfig>>() {
                            });
            return response.getBody() == null ? Collections.emptyList() : response.getBody();
        } catch (HttpClientErrorException e) {
            log.debug("Error retrieving configurations", e);
            return Collections.emptyList();
        }
    }

    @Override
    public ConnectionConfig addConnectionConfig(ConnectionConfig connectionConfig) {
        if (securityLevel == SecurityLevel.STRICT) {
            throw new InvalidStrictOperationException();
        }
        try {
            ResponseEntity<ConnectionConfig> response = restTemplate
                    .postForEntity(CONFIG_ENDPOINT, connectionConfig, ConnectionConfig.class);
            return response.getBody();
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
            restTemplate.delete(CONFIG_ENDPOINT + "/" + configName);
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
            HttpEntity<ConnectionConfig> request = new HttpEntity<>(connectionConfig);
            ResponseEntity<ConnectionConfig> response = restTemplate
                    .exchange(CONFIG_ENDPOINT, HttpMethod.PUT, request, ConnectionConfig.class);
            return response.getBody();
        } catch (NotFound e) {
            log.trace("Connection not found: {}", connectionConfig.getName());
            throw new ConnectionNotFoundException(e);
        } catch (HttpServerErrorException e) {
            log.error("Error editing connection config {}!", connectionConfig.getName(), e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }
}
