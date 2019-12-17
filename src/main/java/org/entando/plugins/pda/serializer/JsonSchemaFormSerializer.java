package org.entando.plugins.pda.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.util.List;
import org.entando.plugins.pda.core.model.form.Form;
import org.entando.plugins.pda.core.model.form.FormField;
import org.entando.plugins.pda.core.model.form.FormFieldInteger;
import org.entando.plugins.pda.core.model.form.FormFieldText;
import org.entando.plugins.pda.core.model.form.FormFieldType;
import org.springframework.stereotype.Component;

@Component
public class JsonSchemaFormSerializer extends StdSerializer<JsonSchemaForm> {
    private static final String SCHEMA_VERSION = "$schema";
    private static final String SCHEMA_ID = "$id";

    private static final String TITLE = "title";
    private static final String TYPE = "type";
    private static final String REQUIRED = "required";
    private static final String PROPERTIES = "properties";
    private static final String DESCRIPTION = "description";

    private static final String TYPE_OBJECT = "object";
    private static final String TYPE_BOOLEAN = "boolean";
    private static final String TYPE_STRING = "string";
    private static final String TYPE_INTEGER = "integer";

    private static final String TYPE_INTEGER_MIN = "minimum";
    private static final String TYPE_INTEGER_MAX = "maximum";
    private static final String TYPE_STRING_MIN = "minLength";
    private static final String TYPE_STRING_MAX = "maxLength";

    private static final ObjectMapper MAPPER;

    static {
        MAPPER = new ObjectMapper();
        SimpleModule jsonSchemaModule = new SimpleModule();
        jsonSchemaModule.addSerializer(new JsonSchemaFormSerializer());
        MAPPER.registerModule(jsonSchemaModule);
    }

    protected JsonSchemaFormSerializer() {
        super(JsonSchemaForm.class);
    }

    @Override
    public void serialize(JsonSchemaForm schema, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
            throws IOException {

        jsonGenerator.writeStartObject();
        writeSchemaHeder(jsonGenerator, schema);

        writeFieldType(jsonGenerator, TYPE_OBJECT);
        jsonGenerator.writeFieldName(PROPERTIES);
        jsonGenerator.writeStartObject();

        for (Form form : schema.getForms()) {
            jsonGenerator.writeFieldName(form.getId());
            jsonGenerator.writeStartObject();
            writeTitle(jsonGenerator, form.getName());
            jsonGenerator.writeStringField(TYPE, TYPE_OBJECT);

            writeRequiredFields(jsonGenerator, form.getFields());
            writeProperties(jsonGenerator, form.getFields());

            jsonGenerator.writeEndObject();
        }

        jsonGenerator.writeEndObject();
        jsonGenerator.writeEndObject();
    }

    private void writeSchemaHeder(JsonGenerator jsonGenerator, JsonSchemaForm schema) throws IOException {
        jsonGenerator.writeStringField(SCHEMA_VERSION, schema.getVersion());
        jsonGenerator.writeStringField(SCHEMA_ID, schema.getId());
    }

    private void writeTitle(JsonGenerator jsonGenerator, String title) throws IOException {
        jsonGenerator.writeStringField(TITLE, title);
    }

    private void writeDescription(JsonGenerator jsonGenerator, String description) throws IOException {
        if (description != null && !description.trim().isEmpty()) {
            jsonGenerator.writeStringField(DESCRIPTION, description);
        }
    }

    private void writeRequiredFields(JsonGenerator jsonGenerator, List<FormField> fields) throws IOException {
        jsonGenerator.writeArrayFieldStart(REQUIRED);

        for (FormField field : fields) {
            if (field.isRequired()) {
                jsonGenerator.writeString(field.getName());
            }
        }

        jsonGenerator.writeEndArray();
    }

    private void writeProperties(JsonGenerator jsonGenerator, List<FormField> fields) throws IOException {
        jsonGenerator.writeFieldName(PROPERTIES);
        jsonGenerator.writeStartObject();

        for (FormField field : fields) {
            jsonGenerator.writeFieldName(field.getName());
            jsonGenerator.writeStartObject();

            writeFieldType(jsonGenerator, field.getType());
            writeTitle(jsonGenerator, field.getLabel());
            writeDescription(jsonGenerator, field.getPlaceholder());
            writeFieldMinMax(jsonGenerator, field);

            jsonGenerator.writeEndObject();
        }

        jsonGenerator.writeEndObject();
    }

    private void writeFieldType(JsonGenerator jsonGenerator, FormFieldType fieldType) throws IOException {
        String type;
        switch (fieldType) {
            case INTEGER:
                type = TYPE_INTEGER;
                break;
            case BOOLEAN:
                type = TYPE_BOOLEAN;
                break;
            default:
                type = TYPE_STRING;
                break;
        }

        writeFieldType(jsonGenerator, type);
    }

    private void writeFieldType(JsonGenerator jsonGenerator, String fieldType) throws IOException {
        jsonGenerator.writeStringField(TYPE, fieldType);
    }

    private void writeFieldMinMax(JsonGenerator jsonGenerator, FormField field) throws IOException {
        if (field.getType().equals(FormFieldType.INTEGER)) {
            FormFieldInteger intField = (FormFieldInteger) field;
            if (intField.getMinValue() != null) {
                jsonGenerator.writeNumberField(TYPE_INTEGER_MIN, intField.getMinValue());
            }

            if (intField.getMaxValue() != null) {
                jsonGenerator.writeNumberField(TYPE_INTEGER_MAX, intField.getMaxValue());
            }
        } else if (field.getType().equals(FormFieldType.STRING)) {
            FormFieldText strField = (FormFieldText) field;
            if (strField.getMinLength() != null) {
                jsonGenerator.writeNumberField(TYPE_STRING_MIN, strField.getMinLength());
            }

            if (strField.getMaxLength() != null) {
                jsonGenerator.writeNumberField(TYPE_STRING_MAX, strField.getMaxLength());
            }
        }
    }
}
