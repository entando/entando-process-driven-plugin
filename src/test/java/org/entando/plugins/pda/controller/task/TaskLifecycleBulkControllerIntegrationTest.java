package org.entando.plugins.pda.controller.task;

import static org.apache.commons.lang.RandomStringUtils.randomNumeric;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import java.util.Arrays;
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
public class TaskLifecycleBulkControllerIntegrationTest {

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
    public void shouldBulkClaimTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/claim", FAKE_CONNECTION))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkUnclaimTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/unclaim", FAKE_CONNECTION))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkAssignTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/assign/testUser", FAKE_CONNECTION))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkStartTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/start", FAKE_CONNECTION))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkPauseTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/pause", FAKE_CONNECTION))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkResumeTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/resume", FAKE_CONNECTION))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }

    @Test
    public void shouldBulkCompleteTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/bulk/tasks/complete", FAKE_CONNECTION))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }
}
