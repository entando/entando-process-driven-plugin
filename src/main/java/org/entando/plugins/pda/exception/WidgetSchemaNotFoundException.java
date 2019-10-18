package org.entando.plugins.pda.exception;

import org.entando.web.exception.NotFoundException;

public class WidgetSchemaNotFoundException extends NotFoundException {

    public WidgetSchemaNotFoundException() {
        super("org.entando.error.widget.config.schema.notFound");
    }

}
