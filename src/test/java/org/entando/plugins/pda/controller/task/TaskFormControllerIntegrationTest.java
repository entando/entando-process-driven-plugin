package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_3;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_3;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_2;
import static org.entando.plugins.pda.core.utils.TestUtils.randomStringId;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.hamcrest.Matchers.is;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.service.ConnectionConfigService;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
class TaskFormControllerIntegrationTest {

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;

    @BeforeEach
    public void setup() throws IOException {
        connectionConfigService.setClient(client);
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setName(FAKE_CONNECTION);
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createSecret(client, connectionConfig);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, entandoPluginName, FAKE_CONNECTION);
    }

    @Test
    void testGetSimpleTaskFormJsonSchema() throws Exception {
        MvcResult result = mockMvc.perform(get(String.format("/connections/%s/tasks/{id}/form", FAKE_CONNECTION)
                .replace("{id}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String expected = readFromFile("simple_task_form_json_schema.json");
        assertEquals(expected, json, JSONCompareMode.STRICT);
    }

    @Test
    void testGetFullTaskFormJsonSchema() throws Exception {
        MvcResult result = mockMvc.perform(get(String.format("/connections/%s/tasks/{id}/form", FAKE_CONNECTION)
                .replace("{id}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String expected = readFromFile("full_task_form_json_schema.json");
        assertEquals(expected, json, JSONCompareMode.STRICT);
    }

    @Test
    void testGetTaskFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{id}/form", FAKE_CONNECTION)
                .replace("{id}", randomStringId())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

    @Test
    void testSubmitTaskForm() throws Exception {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TASK_FORM_PROP_KEY_1, TASK_FORM_PROP_1);
        variables.put(TASK_FORM_PROP_KEY_2, TASK_FORM_PROP_2);
        variables.put(TASK_FORM_PROP_KEY_3, TASK_FORM_PROP_3);

        Map<String, Object> request = new HashMap<>();
        request.put(TASK_FORM_ID_1, variables);

        mockMvc.perform(post(String.format("/connections/%s/tasks/{id}/form", FAKE_CONNECTION)
                .replace("{id}", TASK_ID_1))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload", is(TASK_ID_1)))
                .andReturn();
    }

    @Test
    void testSubmitTaskFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(post(String.format("/connections/%s/tasks/{id}/form", FAKE_CONNECTION)
                .replace("{id}", randomStringId()))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(new HashMap<>())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }
}
