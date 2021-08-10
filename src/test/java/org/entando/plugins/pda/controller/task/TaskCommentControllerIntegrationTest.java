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
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.service.task.request.CreateCommentRequest;
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
import org.springframework.test.web.servlet.MvcResult;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
class TaskCommentControllerIntegrationTest {

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
        EntandoPluginTestHelper.setupEntandoPluginAndSecret(client, FAKE_CONNECTION, entandoPluginName);
    }

    @Test
    void testListTaskComments() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_1.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_COMMENT_ID_1_1)))
                .andExpect(jsonPath("payload[0].text", is(TASK_COMMENT_1_1)))
                .andExpect(jsonPath("payload[1].id", is(TASK_COMMENT_ID_1_2)))
                .andExpect(jsonPath("payload[1].text", is(TASK_COMMENT_1_2)));

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_COMMENT_ID_2_1)))
                .andExpect(jsonPath("payload[0].text", is(TASK_COMMENT_2_1)));
    }

    @Test
    void testGetTaskComment() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments/{commentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)
                .replace("{commentId}", TASK_COMMENT_ID_1_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_COMMENT_ID_1_2)))
                .andExpect(jsonPath("payload.text", is(TASK_COMMENT_1_2)));
    }

    @Test
    void testGetInvalidCommentShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments/{commentId}", FAKE_CONNECTION)
                .replace("{taskId}", "invalid")
                .replace("{commentId}", TASK_COMMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments/{commentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)
                .replace("{commentId}", "invalid")))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetCommentFromWrongTaskShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments/{commentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)
                .replace("{commentId}", TASK_COMMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateDeleteTaskComment() throws Exception {
        String newComment = "This is a fresh comment!";
        CreateCommentRequest request = CreateCommentRequest.builder()
                .comment(newComment)
                .build();

        MvcResult result = mockMvc.perform(post(String.format("/connections/%s/tasks/{taskId}/comments", FAKE_CONNECTION)
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

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_COMMENTS_2.length + 1)));

        mockMvc.perform(delete(String.format("/connections/%s/tasks/{taskId}/comments/{commentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)
                .replace("{commentId}", commentId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload", is(commentId)));

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/comments", FAKE_CONNECTION)
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
