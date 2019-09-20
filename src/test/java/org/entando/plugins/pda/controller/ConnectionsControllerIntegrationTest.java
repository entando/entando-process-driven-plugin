package org.entando.plugins.pda.controller;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.github.tomakehurst.wiremock.client.WireMock;
import java.util.HashMap;
import java.util.Map;
import org.apache.http.entity.ContentType;
import org.codehaus.jackson.map.ObjectMapper;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class })
@AutoConfigureWireMock(port = 8089)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConnectionsControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;

    private ObjectMapper mapper = new ObjectMapper();

    @Before
    public void setup() {
        stubFor(WireMock.get(urlEqualTo("/config/entando-process-driven-plugin"))
            .willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json")
                .withBodyFile("mock_connection_configs.json")));

        stubFor(WireMock.put(urlEqualTo("/config/entando-process-driven-plugin"))
                .willReturn(aResponse().withStatus(200)));
    }

    @Test
    public void testListConnections() throws Exception {
        mockMvc.perform(get("/connections"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is("fakeProduction")))
                .andExpect(jsonPath("payload[1].name", is("fakeStaging")));
    }

    @Test
    public void testGetConnection() throws Exception {
        mockMvc.perform(get("/connections/fakeStaging"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is("fakeStaging")));

        mockMvc.perform(get("/connections/fakeProduction"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is("fakeProduction")));
    }

    @Test
    public void testCreateEditAndDeleteConnection() throws Exception {
        Map<String,String> properties = new HashMap<>();
        properties.put("myCustomProperty1", "myCustomValue1");
        properties.put("myCustomProperty2", "myCustomValue2");

        ConnectionDto createRequest = ConnectionDto.builder()
                .name("myConnection")
                .host("myurl.com")
                .port("9090")
                .username("myUsername")
                .password("myPassword")
                .connectionTimeout(30000)
                .schema("https")
                .engine(FakeEngine.TYPE)
                .properties(properties)
                .build();

        mockMvc.perform(post("/connections").contentType(ContentType.APPLICATION_JSON.getMimeType()).content(mapper.writeValueAsString(createRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(createRequest.getName())))
                .andExpect(jsonPath("payload.host", is(createRequest.getHost())))
                .andExpect(jsonPath("payload.port", is(createRequest.getPort())))
                .andExpect(jsonPath("payload.username", is(createRequest.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(createRequest.getSchema())))
                .andExpect(jsonPath("payload.engine", is(createRequest.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(createRequest.getConnectionTimeout())))
                .andExpect(jsonPath("payload.properties.myCustomProperty1", is(createRequest.getProperties().get("myCustomProperty1"))))
                .andExpect(jsonPath("payload.properties.myCustomProperty2", is(createRequest.getProperties().get("myCustomProperty2"))));

        mockMvc.perform(get("/connections/myConnection"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(createRequest.getName())));

        ConnectionDto updateRequest = ConnectionDto.builder()
                .name("myConnection")
                .host("myurledited.com")
                .port("9091")
                .username("myUsername2")
                .password("myPassword2")
                .connectionTimeout(45000)
                .schema("http")
                .engine(FakeEngine.TYPE)
                .build();

        mockMvc.perform(put("/connections/myConnection").contentType(ContentType.APPLICATION_JSON.getMimeType()).content(mapper.writeValueAsString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(updateRequest.getName())))
                .andExpect(jsonPath("payload.host", is(updateRequest.getHost())))
                .andExpect(jsonPath("payload.port", is(updateRequest.getPort())))
                .andExpect(jsonPath("payload.username", is(updateRequest.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(updateRequest.getSchema())))
                .andExpect(jsonPath("payload.engine", is(updateRequest.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(updateRequest.getConnectionTimeout())))
                .andExpect(jsonPath("payload.properties").doesNotExist());

        mockMvc.perform(delete("/connections/myConnection"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)));

        mockMvc.perform(get("/connections/myConnection"))
                .andDo(print()).andExpect(status().isNotFound());

        mockMvc.perform(get("/connections"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is("fakeProduction")))
                .andExpect(jsonPath("payload[1].name", is("fakeStaging")));
    }

    @Test
    public void testCreateEditNameAndDeleteConnection() throws Exception {
        Map<String,String> properties = new HashMap<>();
        properties.put("myCustomProperty1", "myCustomValue1");
        properties.put("myCustomProperty2", "myCustomValue2");

        ConnectionDto createRequest = ConnectionDto.builder()
                .name("myConnection")
                .host("myurl.com")
                .port("9090")
                .username("myUsername")
                .password("myPassword")
                .connectionTimeout(30000)
                .schema("https")
                .engine(FakeEngine.TYPE)
                .properties(properties)
                .build();

        mockMvc.perform(post("/connections").contentType(ContentType.APPLICATION_JSON.getMimeType()).content(mapper.writeValueAsString(createRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(createRequest.getName())))
                .andExpect(jsonPath("payload.host", is(createRequest.getHost())))
                .andExpect(jsonPath("payload.port", is(createRequest.getPort())))
                .andExpect(jsonPath("payload.username", is(createRequest.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(createRequest.getSchema())))
                .andExpect(jsonPath("payload.engine", is(createRequest.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(createRequest.getConnectionTimeout())))
                .andExpect(jsonPath("payload.properties.myCustomProperty1", is(createRequest.getProperties().get("myCustomProperty1"))))
                .andExpect(jsonPath("payload.properties.myCustomProperty2", is(createRequest.getProperties().get("myCustomProperty2"))));

        mockMvc.perform(get("/connections/myConnection"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(createRequest.getName())));

        ConnectionDto updateRequest = ConnectionDto.builder()
                .name("newName")
                .host("myurledited.com")
                .port("9091")
                .username("myUsername2")
                .password("myPassword2")
                .connectionTimeout(45000)
                .schema("http")
                .engine(FakeEngine.TYPE)
                .build();

        mockMvc.perform(put("/connections/myConnection").contentType(ContentType.APPLICATION_JSON.getMimeType()).content(mapper.writeValueAsString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(updateRequest.getName())))
                .andExpect(jsonPath("payload.host", is(updateRequest.getHost())))
                .andExpect(jsonPath("payload.port", is(updateRequest.getPort())))
                .andExpect(jsonPath("payload.username", is(updateRequest.getUsername())))
                .andExpect(jsonPath("payload.password").doesNotExist())
                .andExpect(jsonPath("payload.schema", is(updateRequest.getSchema())))
                .andExpect(jsonPath("payload.engine", is(updateRequest.getEngine())))
                .andExpect(jsonPath("payload.connectionTimeout", is(updateRequest.getConnectionTimeout())))
                .andExpect(jsonPath("payload.password").doesNotExist());

        mockMvc.perform(get("/connections/myConnection"))
                .andDo(print()).andExpect(status().isNotFound());

        mockMvc.perform(get("/connections/newName"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(updateRequest.getName())));

        mockMvc.perform(delete("/connections/newName"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)));

        mockMvc.perform(get("/connections/newName"))
                .andDo(print()).andExpect(status().isNotFound());

        mockMvc.perform(get("/connections"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is("fakeProduction")))
                .andExpect(jsonPath("payload[1].name", is("fakeStaging")));
    }

    @Test
    public void testCreateInvalidEngine() throws Exception {
        ConnectionDto request = ConnectionDto.builder()
                .name("myConnection")
                .host("myurl.com")
                .port("9090")
                .username("myUsername")
                .password("myPassword")
                .connectionTimeout(30000)
                .schema("https")
                .engine("invalid")
                .build();

        mockMvc.perform(post("/connections").contentType(ContentType.APPLICATION_JSON.getMimeType()).content(mapper.writeValueAsString(request)))
                .andDo(print()).andExpect(status().isNotFound());
    }
}
