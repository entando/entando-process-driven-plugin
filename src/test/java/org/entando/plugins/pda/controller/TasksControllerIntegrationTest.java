package org.entando.plugins.pda.controller;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.github.tomakehurst.wiremock.client.WireMock;
import org.codehaus.jackson.map.ObjectMapper;
import org.entando.plugins.pda.core.service.task.FakeTaskService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class })
@AutoConfigureWireMock(port = 8089)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TasksControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;

    private ObjectMapper mapper = new ObjectMapper();

    @Before
    public void setup() {
        stubFor(WireMock.get(urlEqualTo("/config/entando-process-driven-plugin"))
                .willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json")
                        .withBodyFile("mock_connection_configs.json")));

        stubFor(WireMock.put(urlEqualTo("/config/entando-process-driven-plugin"))
                .willReturn(aResponse().withStatus(200)));
    }

    @Test
    public void testListTasks() throws Exception {
        mockMvc.perform(get("/connections/fakeConn/tasks"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is(FakeTaskService.TASK_NAME_1)))
                .andExpect(jsonPath("payload[1].name", is(FakeTaskService.TASK_NAME_2)));
    }
}
