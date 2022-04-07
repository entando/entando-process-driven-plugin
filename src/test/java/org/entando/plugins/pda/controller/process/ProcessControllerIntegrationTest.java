package org.entando.plugins.pda.controller.process;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.io.IOException;
import java.util.UUID;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.service.process.FakeProcessService;
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
class ProcessControllerIntegrationTest {

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private MockMvc mockMvc;

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
    void testListProcessesDefinitions() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/processes/definitions", FAKE_CONNECTION)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is(FakeProcessService.PROCESS_NAME_1)))
                .andExpect(jsonPath("payload[1].name", is(FakeProcessService.PROCESS_NAME_2)));
    }

    @Test
    void testGetProcessDiagram() throws Exception {
        MvcResult result = mockMvc.perform(get(String.format("/connections/%s/processes/{id}/diagram", FAKE_CONNECTION)
                .replace("{id}", FakeProcessService.PROCESS_ID_1)))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        String diagram = result.getResponse().getContentAsString();
        String expected = readFromFile(FakeProcessService.PROCESS_DIAGRAM_FILENAME_1);

        assertThat(diagram).isEqualTo(expected);
    }

    @Test
    void testGetProcessDiagramShouldThrowNotFound() throws Exception {
        mockMvc.perform(get(String.format("/connections/%s/processes/{id}/diagram", FAKE_CONNECTION)
                .replace("{id}", UUID.randomUUID().toString())))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andReturn();
    }

}
