package org.entando.plugins.pda.controller.group;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.util.Arrays;
import java.util.Collections;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.service.group.FakeGroupService;
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
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "entando.plugin.security.level=LENIENT")
@EnableKubernetesMockClient(crud = true, https = false)
class GroupControllerIntegrationTest {

    private static final String GROUP_1 = "group1";
    private static final String GROUP_2 = "group2";
    private static final String GROUP_3 = "group3";
    private static final String GROUP_4 = "group4";

    private static final String FAKE_CONNECTION = "fakeConnection";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FakeGroupService groupService;

    @Autowired
    private ConnectionConfigService connectionConfigService;

    @Value("${entando.plugin.name}")
    private String entandoPluginName;

    static KubernetesClient client;

    @BeforeEach
    public void init() throws Exception {
        connectionConfigService.setClient(client);
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        connectionDto.setName(FAKE_CONNECTION);
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);
        ConnectionConfig connectionConfig = ConnectionConfigMapper.fromConnection(connection);
        connectionConfig.getProperties().put(ConnectionConfigMapper.PASSWORD, null);
        EntandoPluginTestHelper.createSecret(client, connectionConfig);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, entandoPluginName, FAKE_CONNECTION);
    }

    @Test
    void shouldListAllGroups() throws Exception {
        groupService.addGroups("process-1", Arrays.asList(GROUP_1, GROUP_2, GROUP_3));
        groupService.addGroups("process-2", Collections.singletonList(GROUP_4));

        mockMvc.perform(get(String.format("/connections/%s/groups", FAKE_CONNECTION)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(MockMvcResultMatchers
                        .jsonPath("payload", containsInAnyOrder(GROUP_1, GROUP_2, GROUP_3, GROUP_4)));
    }

    @Test
    void shouldListGroupsByProcess() throws Exception {
        String processId = "process-1";
        groupService.addGroups(processId, Arrays.asList(GROUP_1, GROUP_2));

        mockMvc.perform(get(String
                .format("/connections/%s/groups?processId=%s", FAKE_CONNECTION, processId)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(MockMvcResultMatchers.jsonPath("payload", containsInAnyOrder(GROUP_1, GROUP_2)));
    }
}
