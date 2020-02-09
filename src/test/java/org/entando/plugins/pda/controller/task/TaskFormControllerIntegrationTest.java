package org.entando.plugins.pda.controller.task;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_3;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_1;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_2;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_FORM_PROP_KEY_3;
import static org.entando.plugins.pda.core.utils.TestUtils.TASK_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.minifyJsonString;
import static org.entando.plugins.pda.core.utils.TestUtils.randomStringId;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.skyscreamer.jsonassert.JSONCompareMode;
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
public class TaskFormControllerIntegrationTest {

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
    public void testGetTaskFormJsonSchema() throws Exception {
        MvcResult result = mockMvc.perform(get("/connections/fakeProduction/tasks/{id}/form"
                .replace("{id}", TASK_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String expected = minifyJsonString(readFromFile("task_form_json_schema_1.json"));
        assertEquals(expected, json, JSONCompareMode.STRICT);
    }

    @Test
    public void testGetTaskFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/{id}/form"
                .replace("{id}", randomStringId())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

    @Test
    public void testSubmitTaskForm() throws Exception {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TASK_FORM_PROP_KEY_1, TASK_FORM_PROP_1);
        variables.put(TASK_FORM_PROP_KEY_2, TASK_FORM_PROP_2);
        variables.put(TASK_FORM_PROP_KEY_3, TASK_FORM_PROP_3);

        Map<String, Object> request = new HashMap<>();
        request.put(TASK_FORM_ID_1, variables);

        mockMvc.perform(post("/connections/fakeProduction/tasks/{id}/form"
                .replace("{id}", TASK_ID_1))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("payload", is(TASK_ID_1)))
                .andReturn();
    }

    @Test
    public void testSubmitTaskFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(post("/connections/fakeProduction/tasks/{id}/form"
                .replace("{id}", randomStringId()))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(new HashMap<>())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

}
