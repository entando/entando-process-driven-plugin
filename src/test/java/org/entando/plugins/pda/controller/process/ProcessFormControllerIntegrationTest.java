package org.entando.plugins.pda.controller.process;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_FORM_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_FORM_PROP_1;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_FORM_PROP_2;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_FORM_PROP_KEY_1;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_FORM_PROP_KEY_2;
import static org.entando.plugins.pda.core.utils.TestUtils.PROCESS_ID_1;
import static org.entando.plugins.pda.core.utils.TestUtils.minifyJsonString;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class ProcessFormControllerIntegrationTest {

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
    public void testGetProcessFormJsonSchema() throws Exception {
        MvcResult result = mockMvc.perform(get("/connections/fakeProduction/processes/definitions/{id}/form"
                .replace("{id}", PROCESS_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String expected = minifyJsonString(readFromFile("process_form_json_schema_1.json"));
        assertThat(json).isEqualTo(expected);
    }

    @Test
    public void testGetProcessFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/processes/definitions/{id}/form"
                .replace("{id}", UUID.randomUUID().toString())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

    @Test
    public void testSubmitProcessForm() throws Exception {
        Map<String, Object> variables = new ConcurrentHashMap<>();
        variables.put(PROCESS_FORM_PROP_KEY_1, PROCESS_FORM_PROP_1);
        variables.put(PROCESS_FORM_PROP_KEY_2, PROCESS_FORM_PROP_2);

        Map<String, Object> request = new ConcurrentHashMap<>();
        request.put(PROCESS_FORM_ID_1, variables);

        mockMvc.perform(post("/connections/fakeProduction/processes/definitions/{id}/form"
                .replace("{id}", PROCESS_ID_1))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void testSubmitProcessFormShouldThrowNotFound() throws Exception {
        mockMvc.perform(post("/connections/fakeProduction/processes/definitions/{id}/form"
                .replace("{id}", UUID.randomUUID().toString()))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .content(mapper.writeValueAsString(new HashMap<>())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

}
