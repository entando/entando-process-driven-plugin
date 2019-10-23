package org.entando.plugins.pda.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;
import org.entando.connectionconfigconnector.exception.ConnectionAlreadyExistsException;
import org.entando.connectionconfigconnector.exception.ConnectionNotFoundException;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.connectionconfigconnector.service.ConnectionConfigConnector;
import org.entando.connectionconfigconnector.service.impl.InMemoryConnectionConfigConnector;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class ConnectionServiceUnitTest {

    private ConnectionService connectionService;
    private EngineFactory engineFactory;

    private ConnectionConfigConnector connectionConfigConnector;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before()
    public void setup() {
        engineFactory = mock(EngineFactory.class);
        when(engineFactory.getEngine(any())).thenReturn(mock(Engine.class));

        connectionConfigConnector = new InMemoryConnectionConfigConnector();
        connectionService = new ConnectionService(engineFactory, connectionConfigConnector);
    }

    @Test
    public void shouldListConnections() {
        // Given
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper
                .generateConnectionConfigs(connectionConfigConnector);

        // When
        List<Connection> list = connectionService.list();

        // Then
        assertThat(list.size()).isEqualTo(connectionConfigs.size());
        assertThat(list).extracting(Connection::getName)
                .containsExactlyInAnyOrder(connectionConfigs.get(0).getName(), connectionConfigs.get(1).getName(),
                        connectionConfigs.get(2).getName());
    }

    @Test
    public void shouldGetConnection() {
        // Given
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper
                .generateConnectionConfigs(connectionConfigConnector);
        ConnectionConfig config1 = connectionConfigs.get(0);

        // When
        Connection connection = connectionService.get(config1.getName());

        // Then
        assertThatIsEqual(connection, config1);
    }

    @Test
    public void shouldThrowConnectionNotFoundException() {
        expectedException.expect(ConnectionNotFoundException.class);
        expectedException.expectMessage(ConnectionNotFoundException.MESSAGE_KEY);

        connectionService.get(UUID.randomUUID().toString());
    }

    @Test
    public void shouldCreateConnection() {
        // Given
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper
                .generateConnectionConfigs(connectionConfigConnector);
        int originalSize = connectionConfigs.size();
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();

        // When
        Connection created = connectionService.create(connectionDto);

        // Then
        assertThat(connectionConfigConnector.getConnectionConfigs().size()).isEqualTo(originalSize + 1);
        assertThat(created).isEqualTo(ConnectionConfigMapper.fromDto(connectionDto));
        ConnectionConfig retrieved = connectionConfigConnector.getConnectionConfig(connectionDto.getName());
        assertThatIsEqual(created, retrieved);
    }

    @Test
    public void shouldEditConnection() {
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper
                .generateConnectionConfigs(connectionConfigConnector);
        ConnectionConfig config1 = connectionConfigs.get(0);
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setName(config1.getName());

        Connection edited = connectionService.edit(connectionDto.getName(), connectionDto);

        assertThat(edited).isEqualTo(ConnectionConfigMapper.fromDto(connectionDto));
        ConnectionConfig retrieved = connectionConfigConnector.getConnectionConfig(connectionDto.getName());
        assertThatIsEqual(edited, retrieved);
    }

    @Test
    public void shouldDeleteConnection() {
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper
                .generateConnectionConfigs(connectionConfigConnector);
        int originalSize = connectionConfigs.size();
        ConnectionConfig config1 = connectionConfigs.get(0);

        connectionService.delete(config1.getName());

        assertThat(connectionConfigConnector.getConnectionConfigs().size()).isEqualTo(originalSize - 1);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenEditingInvalidConnection() {
        expectedException.expect(ConnectionNotFoundException.class);
        expectedException.expectMessage(ConnectionNotFoundException.MESSAGE_KEY);

        ConnectionDto request = ConnectionTestHelper.generateConnectionDto();
        connectionService.edit("invalid", request);
    }

    @Test
    public void shouldThrownNotFoundExceptionWhenDeletingInvalidConnection() {
        expectedException.expect(ConnectionNotFoundException.class);
        expectedException.expectMessage(ConnectionNotFoundException.MESSAGE_KEY);

        connectionService.delete(UUID.randomUUID().toString());
    }

    @Test
    public void shouldThrowConnectionAlreadyExistsExceptionWhenAddingDuplicate() {
        expectedException.expect(ConnectionAlreadyExistsException.class);
        expectedException.expectMessage(ConnectionAlreadyExistsException.MESSAGE_KEY);

        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionService.create(connectionDto);
        connectionService.create(connectionDto);
    }

    private void assertThatIsEqual(Connection connection, ConnectionConfig config1) {
        assertThat(connection.getName()).isEqualTo(config1.getName());
        assertThat(connection.getEngine()).isEqualTo(config1.getProperties().get(ConnectionConfigMapper.ENGINE_KEY));
        assertThat(connection.getApp()).isEqualTo(config1.getProperties().get(ConnectionConfigMapper.APP_KEY));
        assertThat(connection.getConnectionTimeout())
                .isEqualTo(Integer.valueOf(config1.getProperties().get(ConnectionConfigMapper.CONNECTION_TIMEOUT)));
        assertThat(connection.getHost()).isEqualTo(config1.getProperties().get(ConnectionConfigMapper.HOST));
        assertThat(connection.getPassword()).isEqualTo(config1.getPassword());
        assertThat(connection.getPort()).isEqualTo(config1.getProperties().get(ConnectionConfigMapper.PORT));
        assertThat(connection.getSchema()).isEqualTo(config1.getProperties().get(ConnectionConfigMapper.SCHEMA));
        assertThat(connection.getUsername()).isEqualTo(config1.getUsername());
    }
}
