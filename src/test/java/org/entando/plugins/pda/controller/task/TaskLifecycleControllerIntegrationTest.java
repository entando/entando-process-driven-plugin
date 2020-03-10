package org.entando.plugins.pda.controller.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.core.StringContains.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.apache.commons.lang.RandomStringUtils;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
import org.entando.plugins.pda.core.service.task.FakeTaskLifecycleService;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.client.RestTemplate;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class TaskLifecycleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private FakeTaskLifecycleService taskLifecycleService;

    @Before
    public void setup() throws IOException {
        ConnectionConfig connectionConfig = ConnectionTestHelper.generateConnectionConfig();
        MockRestServiceServer mockServer = MockRestServiceServer.createServer(configRestTemplate);
        mockServer.expect(ExpectedCount.manyTimes(), requestTo(
                containsString(TestConnectionConfigConfiguration.URL_PREFIX + "/config/fakeProduction")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));
    }

    @Test
    public void shouldClaimTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/claim"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.CLAIM_ACTION);
    }

    @Test
    public void shouldUnclaimTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/unclaim"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.UNCLAIM_ACTION);
    }

    @Test
    public void shouldAssignTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/assign/test"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.ASSIGN_ACTION);
    }

    @Test
    public void shouldStartTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/start"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.START_ACTION);
    }

    @Test
    public void shouldPauseTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/pause"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.PAUSE_ACTION);
    }

    @Test
    public void shouldCompleteTask() throws Exception {
        String taskId = RandomStringUtils.randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/tasks/" + taskId + "/complete"))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(taskLifecycleService.getRecordedActions().get(taskId))
                .contains(FakeTaskLifecycleService.COMPLETE_ACTION);
    }
}
