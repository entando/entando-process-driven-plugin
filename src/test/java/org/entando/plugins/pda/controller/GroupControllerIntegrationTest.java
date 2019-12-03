package org.entando.plugins.pda.controller;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.Collections;
import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.model.ConnectionConfig;
import org.entando.plugins.pda.core.service.group.FakeGroupService;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.client.RestTemplate;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT,
        properties = "entando.plugin.security.level=LENIENT")
public class GroupControllerIntegrationTest {

    private static final String GROUP_1 = "group1";
    private static final String GROUP_2 = "group2";
    private static final String GROUP_3 = "group3";
    private static final String GROUP_4 = "group4";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier(ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE)
    private RestTemplate configRestTemplate;

    @Autowired
    private FakeGroupService groupService;

    private ObjectMapper mapper = new ObjectMapper();

    @Before
    public void init() throws Exception {
        ConnectionConfig connectionConfig = ConnectionTestHelper.generateConnectionConfig();
        MockRestServiceServer mockServer = MockRestServiceServer.createServer(configRestTemplate);
        mockServer.expect(ExpectedCount.manyTimes(), requestTo(
                containsString(TestConnectionConfigConfiguration.URL_PREFIX + "/config/fakeConnection")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess(mapper.writeValueAsString(connectionConfig), MediaType.APPLICATION_JSON));
    }

    @Test
    public void shouldListAllGroups() throws Exception {
        groupService.addGroups("process-1", Arrays.asList(GROUP_1, GROUP_2, GROUP_3));
        groupService.addGroups("process-2", Collections.singletonList(GROUP_4));

        mockMvc.perform(get("/connections/fakeConnection/groups"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(MockMvcResultMatchers
                        .jsonPath("payload", containsInAnyOrder(GROUP_1, GROUP_2, GROUP_3, GROUP_4)));
    }

    @Test
    public void shouldListGroupsByProcess() throws Exception {
        String processId = "process-1";
        groupService.addGroups(processId, Arrays.asList(GROUP_1, GROUP_2));

        mockMvc.perform(get(String
                .format("/connections/fakeConnection/groups?processId=%s", processId)))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(MockMvcResultMatchers.jsonPath("payload", containsInAnyOrder(GROUP_1, GROUP_2)));
    }
}
