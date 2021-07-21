package org.entando.plugins.pda.controller.connection;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.dto.connection.ConnectionDto;
import org.entando.plugins.pda.mapper.ConnectionConfigMapper;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@EnableConfigurationProperties
@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(classes = TestConnectionConfigConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT)
public class ConnectionsControllerStrictIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper mapper = new ObjectMapper();

    @Test
    public void shouldReturnErrorWhenCreatingConnectionConfigOnStrictLevel() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);

        mockMvc.perform(post("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connection)))
                .andDo(print()).andExpect(status().isUnprocessableEntity())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.message", containsString("not allowed")));
    }

    @Test
    public void shouldReturnErrorWhenEditingConnectionConfigOnStrictLevel() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();
        Connection connection = ConnectionConfigMapper.fromDto(connectionDto);

        mockMvc.perform(put("/connections").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(connection)))
                .andDo(print()).andExpect(status().isUnprocessableEntity())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.message", containsString("not allowed")));
    }

    @Test
    public void shouldReturnErrorWhenDeletingConnectionConfigOnStrictLevel() throws Exception {
        ConnectionDto connectionDto = ConnectionTestHelper.generateConnectionDto();

        mockMvc.perform(delete("/connections/" + connectionDto.getName()).contentType(MediaType.APPLICATION_JSON))
                .andDo(print()).andExpect(status().isUnprocessableEntity())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.message", containsString("not allowed")));
    }
}
