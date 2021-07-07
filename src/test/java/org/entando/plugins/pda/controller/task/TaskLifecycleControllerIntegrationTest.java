package org.entando.plugins.pda.controller.task;

import static org.apache.commons.lang.RandomStringUtils.randomNumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.service.task.FakeTaskLifecycleService;
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
public class TaskLifecycleControllerIntegrationTest {

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FakeTaskLifecycleService taskLifecycleService;

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;

    @BeforeEach
    public void setup() throws IOException {
        connectionConfigService.setClient(client);
        EntandoPluginTestHelper.setupEntandoPluginAndSecret(client, FAKE_CONNECTION, entandoPluginName);
    }

    @Test
    public void shouldClaimTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/claim", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.CLAIM_ACTION);
    }

    @Test
    public void shouldUnclaimTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/unclaim", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.UNCLAIM_ACTION);
    }

    @Test
    public void shouldAssignTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders
                .put(String.format("/connections/%s/tasks/%s/assign/test", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.ASSIGN_ACTION);
    }

    @Test
    public void shouldStartTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/start", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.START_ACTION);
    }

    @Test
    public void shouldPauseTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/pause", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.PAUSE_ACTION);
    }

    @Test
    public void shouldResumeTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/resume", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.RESUME_ACTION);
    }

    @Test
    public void shouldCompleteTask() throws Exception {
        String taskId = randomNumeric(5);
        mockMvc.perform(
                MockMvcRequestBuilders.put(String.format("/connections/%s/tasks/%s/complete", FAKE_CONNECTION, taskId)))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.COMPLETE_ACTION);
    }
}
