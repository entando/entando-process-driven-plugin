package org.entando.plugins.pda.serializer;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.entando.plugins.pda.core.model.form.Form;

@Data
@RequiredArgsConstructor
public class JsonSchemaForm {
    private final String version;
    private final String id;
    private final Form form;
}
