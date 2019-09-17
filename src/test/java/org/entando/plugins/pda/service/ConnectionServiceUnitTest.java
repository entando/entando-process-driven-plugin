package org.entando.plugins.pda.service;

import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.dto.connection.ConfigServiceConnectionsResponse;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.engine.EngineFactory;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.entando.web.exception.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ConnectionServiceUnitTest {

    private ConnectionService connectionService;
    private RestTemplate restTemplate;
    private EngineFactory engineFactory;

    @Before()
    public void setup() {
        engineFactory = mock(EngineFactory.class);
        when(engineFactory.getEngine(any())).thenReturn(mock(Engine.class));

        restTemplate = mock(RestTemplate.class);

        when(restTemplate.getForObject(anyString(), eq(ConfigServiceConnectionsResponse.class)))
                .thenReturn(new ConfigServiceConnectionsResponse(ConnectionTestHelper.createConnectionsDto()));

        connectionService = new ConnectionService(engineFactory, "dummyUrl");
        connectionService.setRestTemplate(restTemplate);
    }

    @Test
    public void testListConnections() {
        List<Connection> connections = connectionService.list();

        assertThat(connections).isEqualTo(ConnectionTestHelper.createConnections());
    }

    @Test
    public void testGetConnection() {
        Connection connection = connectionService.get(ConnectionTestHelper.CONNECTION_NAME_1);

        assertThat(connection).isEqualTo(ConnectionTestHelper.createConnections().get(0));
    }

    @Test
    public void testCreateConnection() {
        reset(engineFactory);

        ConnectionDto request = ConnectionTestHelper.createConnectionDto();
        Connection connection = connectionService.create(request);

        verify(engineFactory).validateEngine(eq(request.getEngine()));

        assertThat(connection).isEqualTo(connectionService.fromDto(request));
        assertThat(connectionService.list().size()).isEqualTo(3);
    }

    @Test
    public void testEditConnection() {
        reset(engineFactory);

        ConnectionDto request = ConnectionTestHelper.createConnectionDto();
        Connection connection = connectionService.edit("staging", request);

        verify(engineFactory).validateEngine(eq(request.getEngine()));
        verify(restTemplate).put(any(), any(), eq(ConfigServiceConnectionsResponse.class));

        assertThat(connection).isEqualTo(connectionService.fromDto(request));
    }

    @Test
    public void testDeleteConnections() {
        connectionService.delete("staging");

        verify(restTemplate).put(any(), any(), eq(ConfigServiceConnectionsResponse.class));

        assertThat(connectionService.list().size()).isEqualTo(1);
    }

    @Test(expected = ConnectionNotFoundException.class)
    public void testEditNonExistentConnection() {
        ConnectionDto request = ConnectionTestHelper.createConnectionDto();
        connectionService.edit("invalid", request);
    }

    @Test(expected = ConnectionNotFoundException.class)
    public void testDeleteNonExistentConnection() {
        connectionService.delete("invalid");
    }
}
