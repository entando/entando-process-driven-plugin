package org.entando.plugins.pda.exception;

import org.entando.plugins.pda.core.exception.NotFoundException;

public class EngineNotFoundException extends NotFoundException {

    public EngineNotFoundException() {
        super("org.entando.error.engine.notFound");
    }
}
