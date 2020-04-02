package org.entando.plugins.pda.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.entando.plugins.pda.core.model.form.Form;
import org.entando.plugins.pda.core.model.form.FormField;
import org.entando.plugins.pda.core.model.form.FormFieldDate;
import org.entando.plugins.pda.core.model.form.FormFieldNumber;
import org.entando.plugins.pda.core.model.form.FormFieldSelector;
import org.entando.plugins.pda.core.model.form.FormFieldSubForm;
import org.entando.plugins.pda.core.model.form.FormFieldText;
import org.entando.plugins.pda.core.model.form.FormFieldType;
import org.springframework.stereotype.Component;

@SuppressWarnings({"PMD.TooManyMethods", "PMD.GodClass"})
@Component
public class JsonSchemaFormSerializer extends StdSerializer<JsonSchemaForm> {

    private static final String SCHEMA_VERSION = "$schema";
    private static final String SCHEMA_ID = "$id";

    private static final String TITLE = "title";
    private static final String TYPE = "type";
    private static final String REQUIRED = "required";
    private static final String PROPERTIES = "properties";
    private static final String DESCRIPTION = "description";
    private static final String READ_ONLY = "readOnly";
    private static final String ONE_OF = "oneOf";
    private static final String CONST = "const";
    private static final String ITEMS = "items";
    private static final String DEFAULT = "default";
    private static final String UNIQUE_ITEMS = "uniqueItems";
    private static final String FORMAT = "format";

    private static final String TYPE_OBJECT = "object";
    private static final String TYPE_BOOLEAN = "boolean";
    private static final String TYPE_ARRAY = "array";
    private static final String TYPE_STRING = "string";
    private static final String TYPE_INTEGER = "integer";
    private static final String TYPE_NUMBER = "number";

    private static final String TYPE_NUMBER_MIN = "minimum";
    private static final String TYPE_NUMBER_MAX = "maximum";
    private static final String TYPE_STRING_MIN = "minLength";
    private static final String TYPE_STRING_MAX = "maxLength";
    private static final String TYPE_DATE_FORMAT = "format";
    private static final String TYPE_NUMBER_MULTIPLE = "multipleOf";

    private static final String FORMAT_DATE = "date";
    private static final String FORMAT_DATE_TIME = "date-time";
    private static final String FORMAT_DATA_URL = "data-url";

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
        writeForm(jsonGenerator, schema.getForm(), schema);
    }

    private void writeSchemaHeader(JsonGenerator jsonGenerator, JsonSchemaForm schema) throws IOException {
        jsonGenerator.writeStringField(SCHEMA_VERSION, schema.getVersion());
        jsonGenerator.writeStringField(SCHEMA_ID, schema.getId());
    }

    private void writeTitle(JsonGenerator jsonGenerator, String title) throws IOException {
        if (StringUtils.isNotEmpty(title)) {
            jsonGenerator.writeStringField(TITLE, title);
        }
    }

    private void writeDescription(JsonGenerator jsonGenerator, String description) throws IOException {
        if (!StringUtils.isEmpty(description)) {
            jsonGenerator.writeStringField(DESCRIPTION, description);
        }
    }

    private void writeForm(JsonGenerator jsonGenerator, Form form) throws IOException {
        writeForm(jsonGenerator, form, null);
    }

    private void writeForm(JsonGenerator jsonGenerator, Form form, JsonSchemaForm schema) throws IOException {
        jsonGenerator.writeStartObject();

        if (schema != null) {
            writeSchemaHeader(jsonGenerator, schema);
        }

        writeTitle(jsonGenerator, form.getName());
        writeFieldType(jsonGenerator, TYPE_OBJECT);
        writeRequiredFields(jsonGenerator, form.getFields());
        writeProperties(jsonGenerator, form.getFields());

        jsonGenerator.writeEndObject();
    }

    private void writeField(JsonGenerator jsonGenerator, FormField field) throws IOException {
        jsonGenerator.writeFieldName(field.getName());
        jsonGenerator.writeStartObject();

        writeFieldType(jsonGenerator, field.getType());
        writeTitle(jsonGenerator, field.getLabel());
        writeDescription(jsonGenerator, field.getPlaceholder());
        writeFieldProperties(jsonGenerator, field);

        jsonGenerator.writeEndObject();
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
            if (field.getType().equals(FormFieldType.SUBFORM)) {
                FormFieldSubForm fieldSubForm = (FormFieldSubForm) field;
                jsonGenerator.writeFieldName(fieldSubForm.getName());
                writeForm(jsonGenerator, fieldSubForm.getForm());
            } else {
                writeField(jsonGenerator, field);
            }
        }

        jsonGenerator.writeEndObject();
    }

    private void writeFieldType(JsonGenerator jsonGenerator, FormFieldType fieldType) throws IOException {
        String type;
        switch (fieldType) {
            case INTEGER:
                type = TYPE_INTEGER;
                break;
            case SLIDER:
            case DOUBLE:
                type = TYPE_NUMBER;
                break;
            case BOOLEAN:
                type = TYPE_BOOLEAN;
                break;
            case INPUT_LIST:
            case MULTIPLE:
            case DOCUMENT_LIST:
                type = TYPE_ARRAY;
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

    @SuppressWarnings("PMD.CyclomaticComplexity")
    private void writeFieldProperties(JsonGenerator jsonGenerator, FormField field) throws IOException {
        if (field.isReadOnly()) {
            jsonGenerator.writeBooleanField(READ_ONLY, true);
        }

        if (field.getType() == FormFieldType.INTEGER || field.getType() == FormFieldType.DOUBLE
                || field.getType() == FormFieldType.SLIDER) {
            writeFieldNumberProperties(jsonGenerator, (FormFieldNumber) field);
        } else if (field.getType() == FormFieldType.STRING) {
            writeFieldStringMinMax(jsonGenerator, (FormFieldText) field);
        } else if (field.getType() == FormFieldType.DATE) {
            writeFieldDateFormat(jsonGenerator, (FormFieldDate) field);
        } else if (field.getType() == FormFieldType.COMBO || field.getType() == FormFieldType.RADIO) {
            writeFieldSelector(jsonGenerator, (FormFieldSelector) field);
        } else if (field.getType() == FormFieldType.MULTIPLE) {
            writeFieldMultipleSelector(jsonGenerator, (FormFieldSelector) field);
        } else if (field.getType() == FormFieldType.INPUT_LIST) {
            writeFieldInputList(jsonGenerator);
        } else if (field.getType() == FormFieldType.DOCUMENT) {
            writeFieldDocument(jsonGenerator);
        } else if (field.getType() == FormFieldType.DOCUMENT_LIST) {
            writeFieldDocumentList(jsonGenerator);
        }
    }

    private void writeFieldNumberProperties(JsonGenerator jsonGenerator, FormFieldNumber field) throws IOException {
        if (field.getType() == FormFieldType.INTEGER) {
            if (field.getMinValue() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MIN, field.getMinValue().intValue());
            }

            if (field.getMaxValue() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MAX, field.getMaxValue().intValue());
            }

            if (field.getMultipleOf() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MULTIPLE, field.getMultipleOf().intValue());
            }
        } else {
            if (field.getMinValue() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MIN, field.getMinValue());
            }

            if (field.getMaxValue() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MAX, field.getMaxValue());
            }

            if (field.getMultipleOf() != null) {
                jsonGenerator.writeNumberField(TYPE_NUMBER_MULTIPLE, field.getMultipleOf());
            }
        }
    }

    private void writeFieldStringMinMax(JsonGenerator jsonGenerator, FormFieldText field) throws IOException {
        if (field.getMinLength() != null) {
            jsonGenerator.writeNumberField(TYPE_STRING_MIN, field.getMinLength());
        }

        if (field.getMaxLength() != null) {
            jsonGenerator.writeNumberField(TYPE_STRING_MAX, field.getMaxLength());
        }
    }

    private void writeFieldDateFormat(JsonGenerator jsonGenerator, FormFieldDate field) throws IOException {
        if (field.isWithTime()) {
            jsonGenerator.writeStringField(TYPE_DATE_FORMAT, FORMAT_DATE_TIME);
        } else {
            jsonGenerator.writeStringField(TYPE_DATE_FORMAT, FORMAT_DATE);
        }
    }

    private void writeFieldSelector(JsonGenerator jsonGenerator, FormFieldSelector field) throws IOException {
        if (StringUtils.isNotEmpty(field.getDefaultValue())) {
            jsonGenerator.writeStringField(DEFAULT, field.getDefaultValue());
        }

        writeFieldSelectorOptions(jsonGenerator, field.getOptions());
    }

    private void writeFieldMultipleSelector(JsonGenerator jsonGenerator, FormFieldSelector field) throws IOException {
        jsonGenerator.writeFieldName(ITEMS);
        jsonGenerator.writeStartObject();
        writeFieldType(jsonGenerator, TYPE_STRING);
        writeFieldSelectorOptions(jsonGenerator, field.getOptions());
        jsonGenerator.writeEndObject();
        jsonGenerator.writeBooleanField(UNIQUE_ITEMS, true);
    }

    private void writeFieldSelectorOptions(JsonGenerator jsonGenerator, List<FormFieldSelector.Option> options)
            throws IOException {

        jsonGenerator.writeFieldName(ONE_OF);
        jsonGenerator.writeStartArray();
        for (FormFieldSelector.Option option : options) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField(CONST, option.getValue());
            writeTitle(jsonGenerator, option.getLabel());
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();
    }

    private void writeFieldDocument(JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeStringField(FORMAT, FORMAT_DATA_URL);
    }

    private void writeFieldDocumentList(JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeFieldName(ITEMS);
        jsonGenerator.writeStartObject();
        writeFieldType(jsonGenerator, TYPE_STRING);
        jsonGenerator.writeStringField(FORMAT, FORMAT_DATA_URL);
        jsonGenerator.writeEndObject();
    }

    private void writeFieldInputList(JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeFieldName(ITEMS);
        jsonGenerator.writeStartObject();
        writeFieldType(jsonGenerator, TYPE_STRING);
        jsonGenerator.writeEndObject();
    }
}
