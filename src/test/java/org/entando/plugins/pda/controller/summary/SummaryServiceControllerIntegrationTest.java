package org.entando.plugins.pda.controller.summary;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.controller.connection.TestConnectionConfigConfiguration;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.core.service.summary.DataType;
import org.entando.plugins.pda.core.service.summary.DataTypeService;
import org.entando.plugins.pda.core.service.summary.processor.CardSummaryProcessor;
import org.entando.plugins.pda.core.service.summary.processor.ChartSummaryProcessor;
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
import org.springframework.web.client.RestTemplate;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class SummaryServiceControllerIntegrationTest {
    private static final String DATA_TYPE_1 = MockSummaryProcessor.TYPE;
    private static final String DATA_TYPE_2 = "DataTypeWithoutProcessor";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private DataTypeService dataTypeService;

    @Before
    public void setup() throws IOException {
        ConnectionConfig connectionConfig = ConnectionTestHelper.generateConnectionConfig();
        MockRestServiceServer mockServer = MockRestServiceServer.createServer(configRestTemplate);
        mockServer.expect(ExpectedCount.manyTimes(), requestTo(
                containsString(TestConnectionConfigConfiguration.URL_PREFIX + "/config/fakeProduction")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));

        dataTypeService.setDataTypes(Arrays.asList(
                createDataType(DATA_TYPE_1),
                createDataType(DATA_TYPE_2)));
    }

    @Test
    public void shouldListSummaryTypes() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries/summaryTypes"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(3)))
                .andExpect(jsonPath("payload[0]", is(MockSummaryProcessor.TYPE)))
                .andExpect(jsonPath("payload[1]", is(CardSummaryProcessor.TYPE)))
                .andExpect(jsonPath("payload[2]", is(ChartSummaryProcessor.TYPE)));
    }

    @Test
    public void shouldListDataTypes() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries/dataTypes"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0]", is(DATA_TYPE_1)))
                .andExpect(jsonPath("payload[1]", is(DATA_TYPE_2)));
    }

    @Test
    public void shouldCalculateSummary() throws Exception {
        String request = "MyField";

        mockMvc.perform(post("/connections/fakeProduction/summaries/summaryTypes/" + DATA_TYPE_1.toLowerCase())
                .content(request))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.myField", is(request)));
    }

    @Test
    public void shouldThrowNotFoundForInvalidSummaryType() throws Exception {
        mockMvc.perform(post("/connections/fakeProduction/summaries/summaryTypes/invalid")
                .content("{}"))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
    }

    private DataType createDataType(String type) {
        DataType dataType = mock(DataType.class);
        when(dataType.getId()).thenReturn(type);
        when(dataType.getEngine()).thenReturn(FakeEngine.TYPE);
        return dataType;
    }
}
