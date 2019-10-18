package org.entando.plugins.pda.widget;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kjetland.jackson.jsonSchema.JsonSchemaGenerator;
import org.entando.plugins.pda.exception.WidgetSchemaNotFoundException;
import org.entando.plugins.pda.widget.model.WidgetType;
import org.springframework.stereotype.Component;

@Component
public class WidgetSchemaFactory {

    private final JsonSchemaGenerator schemaGen;

    public WidgetSchemaFactory(JsonSchemaGenerator schemaGen) {
        this.schemaGen = schemaGen;
    }

    public WidgetSchemaFactory() {
        ObjectMapper mapper = new ObjectMapper();
        schemaGen = new JsonSchemaGenerator(mapper);
    }

    public JsonNode getSchema(String type) {
        for (WidgetType widgetType : WidgetType.values()) {
            if (widgetType.code().equalsIgnoreCase(type)) {
                return getSchema(widgetType);
            }
        }

        throw new WidgetSchemaNotFoundException();
    }

    public JsonNode getSchema(WidgetType type) {
        if (type == null) {
            throw new WidgetSchemaNotFoundException();
        }

        return schemaGen.generateJsonSchema(type.schema());
    }

}
