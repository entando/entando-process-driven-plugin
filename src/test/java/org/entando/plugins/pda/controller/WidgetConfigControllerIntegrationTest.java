package org.entando.plugins.pda.controller;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.Scanner;
import org.apache.commons.io.FileUtils;
import org.entando.plugins.pda.core.service.task.FakeTaskService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WidgetConfigControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetTaskListWidgetConfigSchema() throws Exception {
        String schema = FileUtils.readFileToString(
                new ClassPathResource("schemas/task_list_widget_config_schema.json").getFile(), "UTF-8");

        String result = mockMvc.perform(get("/config/schema/TaskList"))
                .andDo(print()).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertThat(result).isEqualTo(minifyJsonString(schema));
    }

    @Test
    public void testGetInvalidWidgetConfigSchema() throws Exception {
        mockMvc.perform(get("/config/schema/invalid"))
                .andDo(print()).andExpect(status().isNotFound());
    }

    private String minifyJsonString(String jsonString) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode json = objectMapper.readValue(jsonString, JsonNode.class);
        return json.toString();
    }
}
