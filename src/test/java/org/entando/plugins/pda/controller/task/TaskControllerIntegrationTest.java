package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_NAME_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_NAME_2;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import java.util.UUID;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.service.ConnectionConfigService;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
class TaskControllerIntegrationTest {

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;
    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() throws IOException {
        connectionConfigService.setClient(client);
        EntandoPluginTestHelper.setupEntandoPluginAndSecret(client, FAKE_CONNECTION, entandoPluginName);
    }

    @Test
    void testListTasks() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks", FAKE_CONNECTION)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is(TASK_NAME_1)))
                .andExpect(jsonPath("payload[1].name", is(TASK_NAME_2)));
    }

    @Test
    void testSearchListTasks() throws Exception {
        String filter = "* 1";

        mockMvc.perform(get(String.format("/connections/%s/tasks?filter=%s", FAKE_CONNECTION, filter)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(1)))
                .andExpect(jsonPath("payload[0].name", is(TASK_NAME_1)));
    }

    @Test
    void testGetTask() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/%s", FAKE_CONNECTION, TASK_ID_1)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_ID_1)))
                .andExpect(jsonPath("payload.name", is(TASK_NAME_1)));

        mockMvc.perform(get(String.format("/connections/%s/tasks/%s", FAKE_CONNECTION, TASK_ID_2)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_ID_2)))
                .andExpect(jsonPath("payload.name", is(TASK_NAME_2)));
    }

    @Test
    void testGetTaskShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/%s", FAKE_CONNECTION, UUID.randomUUID())))
                .andDo(print()).andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
    }
}
