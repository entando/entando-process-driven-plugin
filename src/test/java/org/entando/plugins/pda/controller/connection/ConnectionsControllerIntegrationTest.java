package org.entando.plugins.pda.controller.connection;

import static org.entando.plugins.pda.mapper.ConnectionConfigMapper.USERNAME;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import org.apache.http.entity.ContentType;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.service.ConnectionConfigService;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
public class ConnectionsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;

    @BeforeEach
    public void setup() {
        connectionConfigService.setClient(client);
    }

    @Test
    public void testListConnections() throws Exception {
        // Given
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        EntandoPluginTestHelper.createSecret(client, configDto);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, entandoPluginName, configDto.getName());

        mockMvc.perform(get("/connections"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(1)))
                .andExpect(jsonPath("payload[0].name", is(configDto.getName())));
    }

    @Test
    public void testGetConnection() throws Exception {
        // Given
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig configDto = ConnectionConfigMapper.fromConnection(connection);
        EntandoPluginTestHelper.createSecret(client, configDto);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, entandoPluginName, configDto.getName());

        mockMvc.perform(get("/connections/" + configDto.getName()))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(configDto.getName())))
                .andExpect(jsonPath("payload.username", is(configDto.getProperties().get(USERNAME))));
    }

    @Test
    public void shouldCreateConnection() throws Exception {
        // Given
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createEntandoPlugin(client, entandoPluginName);

        mockMvc.perform(post("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connection)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(connectionDto.getName())))
                .andExpect(jsonPath("payload.url", is(connectionDto.getUrl())))
                .andExpect(jsonPath("payload.username", is(connectionDto.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.engine", is(connectionDto.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(connectionDto.getConnectionTimeout())));
    }

    @Test
    public void shouldEditConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createSecret(client, connectionConfig);
        EntandoPluginTestHelper.createEntandoPlugin(client, entandoPluginName);

        mockMvc.perform(put("/connections")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connection)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(connectionDto.getName())))
                .andExpect(jsonPath("payload.url", is(connectionDto.getUrl())))
                .andExpect(jsonPath("payload.username", is(connectionDto.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.engine", is(connectionDto.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(connectionDto.getConnectionTimeout())))
                .andExpect(jsonPath("payload.properties").doesNotExist());
    }

    @Test
    public void shouldDeleteConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createEntandoPlugin(client, entandoPluginName);

        mockMvc.perform(delete("/connections/" + connectionDto.getName()))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)));
    }

    @Test
    public void testCreateInvalidEngine() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setEngine("invalid");

        mockMvc.perform(post("/connections").contentType(ContentType.APPLICATION_JSON.getMimeType())
                .content(mapper.writeValueAsString(connectionDto)))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isNotFound());
    }

    @Test
    public void shouldHandleConflictErrorWhenAdding() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createEntandoPlugin(client, entandoPluginName);
        connectionConfigService.addConnectionConfig(connectionConfig);

        mockMvc.perform(post("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connection)))
                .andDo(print()).andExpect(status().isConflict())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    public void shouldTestConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createEntandoPlugin(client, entandoPluginName);
        connectionConfigService.addConnectionConfig(connectionConfig);

        mockMvc.perform(get("/connections/{connId}/test".replace("{connId}", connectionConfig.getName())))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload", is(ConnectionService.OK)));
    }
}
