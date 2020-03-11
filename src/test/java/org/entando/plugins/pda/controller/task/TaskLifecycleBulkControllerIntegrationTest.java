package org.entando.plugins.pda.controller.task;

import static org.apache.commons.lang.RandomStringUtils.randomNumeric;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.core.StringContains.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
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
public class TaskLifecycleBulkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    private ObjectMapper mapper = new ObjectMapper();

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
    public void shouldBulkClaimTasks() throws Exception {
        String taskId1 = randomNumeric(5);
        String taskId2 = randomNumeric(5);
        String taskId3 = randomNumeric(5);
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/claim")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/unclaim")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/assign/testUser")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/start")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/pause")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/resume")
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
        mockMvc.perform(MockMvcRequestBuilders.put("/connections/fakeProduction/bulk/tasks/complete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Arrays.asList(taskId1, taskId2, taskId3))))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload[*].id", contains(taskId1, taskId2, taskId3)));
    }
}
