package org.entando.plugins.pda.controller.task;

import static org.entando.plugins.pda.core.service.task.FakeTaskCommentService.TASK_COMMENTS_1;
import static org.entando.plugins.pda.core.service.task.FakeTaskCommentService.TASK_COMMENTS_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_1_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_1_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_2_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_ID_1_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_ID_1_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_COMMENT_ID_2_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_2;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import java.io.IOException;
import org.entando.plugins.pda.config.ConnectionConfigConfiguration;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
import org.entando.plugins.pda.core.service.task.request.CreateCommentRequest;
import org.entando.plugins.pda.model.ConnectionConfig;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class TaskCommentControllerIntegrationTest {

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
    public void testListTaskComments() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments"
                    .replace("{taskId}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_1.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_COMMENT_ID_1_1)))
                .andExpect(jsonPath("payload[0].text", is(TASK_COMMENT_1_1)))
                .andExpect(jsonPath("payload[1].id", is(TASK_COMMENT_ID_1_2)))
                .andExpect(jsonPath("payload[1].text", is(TASK_COMMENT_1_2)));

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments"
                    .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_COMMENT_ID_2_1)))
                .andExpect(jsonPath("payload[0].text", is(TASK_COMMENT_2_1)));
    }

    @Test
    public void testGetTaskComment() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments/{commentId}"
                    .replace("{taskId}", TASK_ID_1)
                    .replace("{commentId}", TASK_COMMENT_ID_1_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_COMMENT_ID_1_2)))
                .andExpect(jsonPath("payload.text", is(TASK_COMMENT_1_2)));
    }

    @Test
    public void testGetInvalidCommentShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments/{commentId}"
                    .replace("{taskId}", "invalid")
                    .replace("{commentId}", TASK_COMMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments/{commentId}"
                    .replace("{taskId}", TASK_ID_1)
                    .replace("{commentId}", "invalid")))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetCommentFromWrongTaskShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments/{commentId}"
                    .replace("{taskId}", TASK_ID_2)
                    .replace("{commentId}", TASK_COMMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateDeleteTaskComment() throws Exception {
        String newComment = "This is a fresh comment!";
        CreateCommentRequest request = CreateCommentRequest.builder()
                .comment(newComment)
                .build();

        MvcResult result = mockMvc.perform(post("/connections/fakeProduction/tasks/{taskId}/comments"
                    .replace("{taskId}", TASK_ID_2))
                    .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                    .content(mapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.text", is(newComment)))
                .andReturn();

        String commentId = JsonPath.read(result.getResponse().getContentAsString(), "$.payload.id");

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments"
                    .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_2.length + 1)));

        mockMvc.perform(delete("/connections/fakeProduction/tasks/{taskId}/comments/{commentId}"
                    .replace("{taskId}", TASK_ID_2)
                    .replace("{commentId}", commentId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload", is(commentId)));

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/comments"
                    .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_COMMENT_ID_2_1)))
                .andReturn();
    }
}
