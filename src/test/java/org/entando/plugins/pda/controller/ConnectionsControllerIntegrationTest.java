package org.entando.plugins.pda.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.apache.http.entity.ContentType;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.client.RestTemplate;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class ConnectionsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    private ObjectMapper mapper = new ObjectMapper();
    private MockRestServiceServer mockRestServiceServer;

    @Before
    public void setup() {
        mockRestServiceServer = MockRestServiceServer.createServer(configRestTemplate);
    }

    @Test
    public void testListConnections() throws Exception {
        List<ConnectionConfig> connectionConfigs = ConnectionTestHelper.generateConnectionConfigs();
        mockRestServiceServer.expect(ExpectedCount.once(),
                requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(mapper.writeValueAsString(connectionConfigs), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/connections"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(3)))
                .andExpect(jsonPath("payload[0].name", is(connectionConfigs.get(0).getName())))
                .andExpect(jsonPath("payload[1].name", is(connectionConfigs.get(1).getName())))
                .andExpect(jsonPath("payload[2].name", is(connectionConfigs.get(2).getName())));

        mockRestServiceServer.verify();
    }

    @Test
    public void testGetConnection() throws Exception {
        ConnectionConfig connectionConfig = ConnectionTestHelper.generateConnectionConfig();
        Connection connection = ConnectionConfigMapper.fromConnectionConfig(connectionConfig);
        mockRestServiceServer.expect(ExpectedCount.once(),
                requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config/" + connectionConfig.getName()))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/connections/" + connectionConfig.getName()))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(connection.getName())))
                .andExpect(jsonPath("payload.username", is(connection.getUsername())));

        mockRestServiceServer.verify();
    }

    @Test
    public void shouldCreateConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        mockRestServiceServer.expect(ExpectedCount.once(),
                requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().json(mapper.writeValueAsString(connectionConfig)))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(connectionConfig)));

        mockMvc.perform(post("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connectionDto)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(connectionDto.getName())))
                .andExpect(jsonPath("payload.host", is(connectionDto.getHost())))
                .andExpect(jsonPath("payload.port", is(connectionDto.getPort())))
                .andExpect(jsonPath("payload.username", is(connectionDto.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(connectionDto.getSchema())))
                .andExpect(jsonPath("payload.engine", is(connectionDto.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(connectionDto.getConnectionTimeout())));

        mockRestServiceServer.verify();
    }

    @Test
    public void shouldEditConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        mockRestServiceServer.expect(ExpectedCount.once(),
                requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config"))
                .andExpect(method(HttpMethod.PUT))
                .andExpect(content().json(mapper.writeValueAsString(connectionConfig)))
                .andRespond(withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));

        mockMvc.perform(put("/connections")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connectionDto)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(connectionDto.getName())))
                .andExpect(jsonPath("payload.host", is(connectionDto.getHost())))
                .andExpect(jsonPath("payload.port", is(connectionDto.getPort())))
                .andExpect(jsonPath("payload.username", is(connectionDto.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(connectionDto.getSchema())))
                .andExpect(jsonPath("payload.engine", is(connectionDto.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(connectionDto.getConnectionTimeout())))
                .andExpect(jsonPath("payload.properties").doesNotExist());

        mockRestServiceServer.verify();
    }

    @Test
    public void shouldDeleteConnection() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        mockRestServiceServer.expect(ExpectedCount.once(),
                requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config/" + connectionDto.getName()))
                .andExpect(method(HttpMethod.DELETE))
                .andRespond(withSuccess());

        mockMvc.perform(delete("/connections/" + connectionDto.getName()))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)));
    }

    @Test
    public void testCreateInvalidEngine() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setEngine("invalid");

        mockMvc.perform(post("/connections").contentType(ContentType.APPLICATION_JSON.getMimeType())
                .content(mapper.writeValueAsString(connectionDto)))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print()).andExpect(status().isNotFound());
    }

    @Test
    public void shouldHandleConflictErrorWhenAdding() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();

        mockRestServiceServer
                .expect(requestTo(TestConnectionConfigConfiguration.URL_PREFIX + "/config"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.CONFLICT));

        mockMvc.perform(post("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connectionDto)))
                .andDo(print()).andExpect(status().isConflict())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }
}
