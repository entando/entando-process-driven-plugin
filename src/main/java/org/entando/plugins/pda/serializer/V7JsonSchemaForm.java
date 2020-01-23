package org.entando.plugins.pda.serializer;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.entando.plugins.pda.core.model.form.Form;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonSerialize(using = JsonSchemaFormSerializer.class)
public class V7JsonSchemaForm extends JsonSchemaForm {
    public static final String JSON_SCHEMA_VERSION = "http://json-schema.org/draft-07/schema#";
    public static final String JSON_SCHEMA_ID = "http://entando.org/schemas/pda-form.json";

    public V7JsonSchemaForm(Form form) {
        super(JSON_SCHEMA_VERSION, JSON_SCHEMA_ID, form);
    }
}
