package org.entando.plugins.pda.serializer;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;

import com.fasterxml.jackson.core.PrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.entando.plugins.pda.core.service.process.FakeProcessService;
import org.junit.Before;
import org.junit.Test;

public class JsonSchemaFormSerializerTest {

    private ObjectMapper mapper;

    @Before
    public void setUp() {
        mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addSerializer(new JsonSchemaFormSerializer());
        mapper.registerModule(module);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    @Test
    public void shouldSerializeProcessFormIntoJsonSchemaV7() throws Exception {
        String result = mapper.writeValueAsString(
                new V7JsonSchemaForm(FakeProcessService.createProcessForm()));
        String expected = readFromFile("process_form_json_schema_1.json");

        assertThat(result).isEqualTo(expected);
    }
}
