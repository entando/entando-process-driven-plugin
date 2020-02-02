package org.entando.plugins.pda.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.UUID;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.summary.FrequencyEnum;
import org.entando.plugins.pda.core.model.summary.Summary;
import org.entando.plugins.pda.core.model.summary.SummaryType;
import org.entando.plugins.pda.core.model.summary.SummaryValue;
import org.entando.plugins.pda.core.model.summary.ValuePercentageSummaryValue;
import org.entando.plugins.pda.core.service.summary.SummaryService;
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
public class SummaryControllerIntegrationTest {

    private static final String ID_PREFIX = "summary";
    private static final String TITLE_PREFIX = "Summary ";
    private static final String LABEL_PREFIX = "Summary Label ";

    private DecimalFormat decimalFormat = new DecimalFormat("#.##");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private SummaryService summaryService;

    @Before
    public void setup() throws IOException {
        ConnectionConfig connectionConfig = ConnectionTestHelper.generateConnectionConfig();
        MockRestServiceServer mockServer = MockRestServiceServer.createServer(configRestTemplate);
        mockServer.expect(ExpectedCount.manyTimes(), requestTo(
                containsString(TestConnectionConfigConfiguration.URL_PREFIX + "/config/fakeProduction")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));

        Summary summary1 = getSummary(1);
        Summary summary2 = getSummary(2);
        summaryService.registerSummary(summary1);
        summaryService.registerSummary(summary2);
    }

    @Test
    public void shouldListSummaries() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].description", is(TITLE_PREFIX + 1)))
                .andExpect(jsonPath("payload[0].engine", is("fake")))
                .andExpect(jsonPath("payload[0].id", is(ID_PREFIX + 1)))
                .andExpect(jsonPath("payload[1].description", is(TITLE_PREFIX + 2)))
                .andExpect(jsonPath("payload[1].engine", is("fake")))
                .andExpect(jsonPath("payload[1].id", is(ID_PREFIX + 2)));
    }

    @Test
    public void shouldGetSummary() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries/" + ID_PREFIX + 1))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.title", is(TITLE_PREFIX + 1)))
                .andExpect(jsonPath("payload.totalLabel", is(LABEL_PREFIX + 1)))
                .andExpect(jsonPath("payload.total", is("1")))
                .andExpect(jsonPath("payload.percentage", is("10")));
    }

//    @Test
//    public void shouldGetSummaryTypes() throws  Exception {
//
//    }
//
//    @Test
//    public void shouldListSummariesByType() throws  Exception {
//
//    }
//
//    @Test
//    public void shouldGetSummaryValueById() throws  Exception {
//
//    }

    @Test
    public void shouldThrowNotFoundForInvalidSummary() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries/" + UUID.randomUUID().toString()))
                .andDo(print()).andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
    }

    @Test
    public void shouldThrowExceptionForInvalidFrequency() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/summaries/" + ID_PREFIX + 1 + "?frequency=invalid"))
                .andDo(print()).andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
    }

    //TODO this should probably not be fixed to the ValuePercentageSummaryValue
    private Summary getSummary(int value) {
        return new Summary() {
            @Override
            public SummaryValue calculateSummary(Connection connection, FrequencyEnum frequency) {
                return new ValuePercentageSummaryValue(TITLE_PREFIX + value, LABEL_PREFIX + value, String.valueOf(value),
                        decimalFormat.format(value * 10));
            }

            @Override
            public String getEngine() {
                return "fake";
            }

            @Override
            public String getId() {
                return ID_PREFIX + value;
            }

            @Override
            public String getDescription() {
                return TITLE_PREFIX + value;
            }

            public SummaryType getSummaryType() {
                return SummaryType.VALUE_PERCENTAGE;
            }
        };
    }
}
