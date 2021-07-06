package org.entando.plugins.pda.controller.summary;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import java.util.Arrays;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.core.service.summary.DataRepository;
import org.entando.plugins.pda.core.service.summary.DataService;
import org.entando.plugins.pda.core.service.summary.processor.CardSummaryProcessor;
import org.entando.plugins.pda.core.service.summary.processor.TimeSeriesSummaryProcessor;
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

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
public class SummaryServiceControllerIntegrationTest {

    private static final String TYPE_1 = MockSummaryProcessor.TYPE;
    private static final String TYPE_2 = "TypeWithoutProcessor";

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DataService dataService;

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;

    @BeforeEach
    public void setup() throws IOException {
        connectionConfigService.setClient(client);
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setName(FAKE_CONNECTION);
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createSecret(client, connectionConfig);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, entandoPluginName, FAKE_CONNECTION);

        dataService.setRepositories(Arrays.asList(
                createDataRepository(TYPE_1),
                createDataRepository(TYPE_2)));
    }

    @Test
    public void shouldListSummaryTypes() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/summaries/summaryTypes", FAKE_CONNECTION)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(3)))
                .andExpect(jsonPath("payload", containsInAnyOrder(
                        MockSummaryProcessor.TYPE, CardSummaryProcessor.TYPE, TimeSeriesSummaryProcessor.TYPE)));
    }

    @Test
    public void shouldListDataRepositories() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/summaries/repositories", FAKE_CONNECTION)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload", containsInAnyOrder(TYPE_1, TYPE_2)));
    }

    @Test
    public void shouldCalculateSummary() throws Exception {
        String request = "MyField";

        mockMvc.perform(
                post(String.format("/connections/%s/summaries/summaryTypes/%s", FAKE_CONNECTION, TYPE_1.toLowerCase()))
                        .content(request))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.myField", is(request)));
    }

    @Test
    public void shouldThrowNotFoundForInvalidSummaryType() throws Exception {
        mockMvc.perform(post(String.format("/connections/%s/summaries/summaryTypes/invalid", FAKE_CONNECTION))
                .content("{}"))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
    }

    private DataRepository createDataRepository(String type) {
        DataRepository dataRepository = mock(DataRepository.class);
        when(dataRepository.getId()).thenReturn(type);
        when(dataRepository.getEngine()).thenReturn(FakeEngine.TYPE);
        return dataRepository;
    }
}
