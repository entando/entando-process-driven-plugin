package org.entando.plugins.pda.controller.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.entando.plugins.pda.core.service.task.FakeTaskAttachmentService.TASK_ATTACHMENTS_1;
import static org.entando.plugins.pda.core.service.task.FakeTaskAttachmentService.TASK_ATTACHMENTS_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_ID_1_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_ID_1_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_ID_2_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_NAME_1_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_NAME_1_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_NAME_2_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ATTACHMENT_NAME_2_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_2;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.File;
import org.entando.plugins.pda.core.request.CreateAttachmentRequest;
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
class TaskAttachmentControllerIntegrationTest {

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
    void testListTaskAttachments() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_1.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_ATTACHMENT_ID_1_1)))
                .andExpect(jsonPath("payload[0].name", is(TASK_ATTACHMENT_NAME_1_1)))
                .andExpect(jsonPath("payload[1].id", is(TASK_ATTACHMENT_ID_1_2)))
                .andExpect(jsonPath("payload[1].name", is(TASK_ATTACHMENT_NAME_1_2)));

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_ATTACHMENT_ID_2_1)))
                .andExpect(jsonPath("payload[0].name", is(TASK_ATTACHMENT_NAME_2_1)));
    }

    @Test
    void testGetTaskAttachment() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)
                .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_ATTACHMENT_ID_1_2)))
                .andExpect(jsonPath("payload.name", is(TASK_ATTACHMENT_NAME_1_2)));
    }

    @Test
    void testGetInvalidAttachmentShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}", FAKE_CONNECTION)
                .replace("{taskId}", "invalid")
                .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_1)
                .replace("{attachmentId}", "invalid")))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAttachmentFromWrongTaskShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)
                .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateDeleteTaskAttachment() throws Exception {
        CreateAttachmentRequest request = CreateAttachmentRequest.builder()
                .file(readFromFile("task_attachment_file.txt"))
                .build();

        MvcResult result = mockMvc
                .perform(post(String.format("/connections/%s/tasks/{taskId}/attachments", FAKE_CONNECTION)
                        .replace("{taskId}", TASK_ID_2))
                        .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .content(mapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.name", is(TASK_ATTACHMENT_NAME_2_2)))
                .andReturn();

        String createdId = JsonPath.read(result.getResponse().getContentAsString(), "$.payload.id");

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_2.length + 1)));

        mockMvc.perform(
                delete(String.format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}", FAKE_CONNECTION)
                        .replace("{taskId}", TASK_ID_2)
                        .replace("{attachmentId}", createdId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload", is(createdId)));

        mockMvc.perform(get(String.format("/connections/%s/tasks/{taskId}/attachments", FAKE_CONNECTION)
                .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_ATTACHMENT_ID_2_1)))
                .andReturn();
    }

    @Test
    void testDownloadTaskAttachment() throws Exception {
        File expected = new File(readFromFile("task_attachment_file.txt"));

        MvcResult result = mockMvc
                .perform(get(String
                        .format("/connections/%s/tasks/{taskId}/attachments/{attachmentId}/download", FAKE_CONNECTION)
                        .replace("{taskId}", TASK_ID_1)
                        .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition",
                        String.format("attachment; filename=%s", expected.getName())))
                .andReturn();

        byte[] file = result.getResponse().getContentAsByteArray();

        assertThat(file).isEqualTo(expected.getDataAsByteArray());
    }
}
