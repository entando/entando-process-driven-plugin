package org.entando.plugins.pda.service;

import java.util.AbstractMap;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConfigServiceConnectionsResponse;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.exception.ConnectionAlreadyExistsException;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.web.exception.BadRequestException;
import org.entando.web.exception.HttpException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class ConnectionService {

    private final EngineFactory engineFactory;
    private final String configServiceUrl;
    private final RestTemplate restTemplate;
    private ConcurrentMap<String, Connection> connections;

    public ConnectionService(EngineFactory engineFactory, @Value("${config.url}") String configServiceUrl,
            RestTemplate restTemplate) {
        this.engineFactory = engineFactory;
        this.configServiceUrl = configServiceUrl;
        this.restTemplate = restTemplate;
    }

    public List<Connection> list() {
        initConnections();
        return connections.values().stream()
                .sorted(Comparator.comparing(Connection::getName))
                .collect(Collectors.toList());
    }

    public Connection get(String id) {
        initConnections();
        return Optional.ofNullable(connections.get(id))
                .orElseThrow(ConnectionNotFoundException::new);
    }

    public void delete(String id) {
        initConnections();
        if (!connections.containsKey(id)) {
            throw new ConnectionNotFoundException();
        }

        connections.remove(id);
        updateConfig();
    }

    public Connection edit(String id, ConnectionDto request) {
        initConnections();
        if (!connections.containsKey(id)) {
            throw new ConnectionNotFoundException();
        }

        Connection connection = fromDto(request);
        if (!connection.getName().equals(id)) { //changed name
            connections.remove(id);
        }

        connections.put(connection.getName(), connection);
        updateConfig();

        return connection;
    }

    public Connection create(ConnectionDto request) {
        initConnections();
        if (connections.containsKey(request.getName())) {
            throw new ConnectionAlreadyExistsException();
        }

        Connection connection = fromDto(request);
        connections.put(connection.getName(), connection);
        updateConfig();

        return connection;
    }

    private void initConnections() {
        if (connections == null) {
            loadConfig();
        }
    }

    private void loadConfig() {
        try {
            ConfigServiceConnectionsResponse response = Optional.ofNullable(restTemplate.getForObject(configServiceUrl,
                    ConfigServiceConnectionsResponse.class))
                    .orElseThrow(BadRequestException::new);

            connections = Optional.ofNullable(response.getPayload())
                    .orElseThrow(BadRequestException::new)
                    .entrySet().stream()
                    .map(e -> new AbstractMap.SimpleEntry<>(e.getKey(), fromDto(e.getValue())))
                    .collect(Collectors.toConcurrentMap(Map.Entry::getKey, Map.Entry::getValue));
        } catch (HttpStatusCodeException e) {
            if (!e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                log.error("Error reading configurations", e);
                throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "org.entando.error.config.read", e);
            }

            log.warn("No configuration available");
            connections = new ConcurrentHashMap<>();
        } catch (ResourceAccessException e) {
            log.error("Error reading configurations", e);
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "org.entando.error.config.read", e);
        }
    }

    private void updateConfig() {
        Map<String, ConnectionDto> request = connections.entrySet().stream() // NOPMD
                .map(e -> new AbstractMap.SimpleEntry<>(e.getKey(), ConnectionDto.fromModel(e.getValue())))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        try {
            restTemplate.put(configServiceUrl, request, ConfigServiceConnectionsResponse.class);
        } catch (HttpStatusCodeException | ResourceAccessException e) {
            log.error("Error updating configurations", e);
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, "org.entando.error.config.write", e);
        }
    }

    public Connection fromDto(ConnectionDto dto) {
        engineFactory.validateEngine(dto.getEngine());

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
