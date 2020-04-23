package org.entando.plugins.pda.serializer;

import static org.entando.plugins.pda.core.utils.TestUtils.readFromFile;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.entando.plugins.pda.core.service.process.FakeProcessFormService;
import org.entando.plugins.pda.core.service.task.FakeTaskFormService;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONCompareMode;

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
    public void shouldSerializeSimpleProcessFormIntoJsonSchemaV7() throws Exception {
        String result = mapper.writeValueAsString(
                new V7JsonSchemaForm(FakeProcessFormService.PROCESS_FORM_1));
        String expected = readFromFile("simple_process_form_json_schema.json");

        assertEquals(expected, result, JSONCompareMode.STRICT);
    }

    @Test
    public void shouldSerializeFullProcessFormIntoJsonSchemaV7() throws Exception {
        String result = mapper.writeValueAsString(
                new V7JsonSchemaForm(FakeProcessFormService.PROCESS_FORM_2));
        String expected = readFromFile("full_process_form_json_schema.json");

        assertEquals(expected, result, JSONCompareMode.STRICT);
    }

    @Test
    public void shouldSerializeSimpleTaskFormIntoJsonSchemaV7() throws Exception {
        String result = mapper.writeValueAsString(
                new V7JsonSchemaForm(FakeTaskFormService.TASK_FORM_1));
        String expected = readFromFile("simple_task_form_json_schema.json");

        assertEquals(expected, result, JSONCompareMode.STRICT);
    }

    @Test
    public void shouldSerializeFullTaskFormIntoJsonSchemaV7() throws Exception {
        String result = mapper.writeValueAsString(
                new V7JsonSchemaForm(FakeTaskFormService.TASK_FORM_2));
        String expected = readFromFile("full_task_form_json_schema.json");

        assertEquals(expected, result, JSONCompareMode.STRICT);
    }
}
