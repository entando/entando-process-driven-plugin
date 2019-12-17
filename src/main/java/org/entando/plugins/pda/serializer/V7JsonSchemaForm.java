package org.entando.plugins.pda.serializer;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import lombok.Data;
import org.entando.plugins.pda.core.model.form.Form;

@Data
@JsonSerialize(using = JsonSchemaFormSerializer.class)
public class V7JsonSchemaForm extends JsonSchemaForm {
    public static final String JSON_SCHEMA_VERSION = "http://json-schema.org/draft-07/schema#";
    public static final String JSON_SCHEMA_ID = "http://entando.org/schemas/pda-form.json";

    public V7JsonSchemaForm(List<Form> forms) {
        super(JSON_SCHEMA_VERSION, JSON_SCHEMA_ID, forms);
    }
}
