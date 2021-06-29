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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import java.io.IOException;
import org.entando.plugins.pda.config.ConnectionConfigConfiguration;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
import org.entando.plugins.pda.core.model.File;
import org.entando.plugins.pda.core.request.CreateAttachmentRequest;
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
public class TaskAttachmentControllerIntegrationTest {

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
    public void testListTaskAttachments() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments"
                    .replace("{taskId}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_1.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_ATTACHMENT_ID_1_1)))
                .andExpect(jsonPath("payload[0].name", is(TASK_ATTACHMENT_NAME_1_1)))
                .andExpect(jsonPath("payload[1].id", is(TASK_ATTACHMENT_ID_1_2)))
                .andExpect(jsonPath("payload[1].name", is(TASK_ATTACHMENT_NAME_1_2)));

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments"
                    .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_2.length)))
                .andExpect(jsonPath("payload[0].id", is(TASK_ATTACHMENT_ID_2_1)))
                .andExpect(jsonPath("payload[0].name", is(TASK_ATTACHMENT_NAME_2_1)));
    }

    @Test
    public void testGetTaskAttachment() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}"
                    .replace("{taskId}", TASK_ID_1)
                    .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(TASK_ATTACHMENT_ID_1_2)))
                .andExpect(jsonPath("payload.name", is(TASK_ATTACHMENT_NAME_1_2)));
    }

    @Test
    public void testGetInvalidAttachmentShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}"
                    .replace("{taskId}", "invalid")
                    .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}"
                    .replace("{taskId}", TASK_ID_1)
                    .replace("{attachmentId}", "invalid")))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAttachmentFromWrongTaskShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}"
                    .replace("{taskId}", TASK_ID_2)
                    .replace("{attachmentId}", TASK_ATTACHMENT_ID_1_1)))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateDeleteTaskAttachment() throws Exception {
        CreateAttachmentRequest request = CreateAttachmentRequest.builder()
                .file(readFromFile("task_attachment_file.txt"))
                .build();

        MvcResult result = mockMvc.perform(post("/connections/fakeProduction/tasks/{taskId}/attachments"
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

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments"
                    .replace("{taskId}", TASK_ID_2)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(TASK_ATTACHMENTS_2.length + 1)));

        mockMvc.perform(delete("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}"
                    .replace("{taskId}", TASK_ID_2)
                    .replace("{attachmentId}", createdId)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload", is(createdId)));

        mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments"
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
    public void testDownloadTaskAttachment() throws Exception {
        File expected = new File(readFromFile("task_attachment_file.txt"));

        MvcResult result = mockMvc.perform(get("/connections/fakeProduction/tasks/{taskId}/attachments/{attachmentId}/download"
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
