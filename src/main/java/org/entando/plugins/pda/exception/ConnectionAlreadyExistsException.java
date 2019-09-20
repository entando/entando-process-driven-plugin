package org.entando.plugins.pda.exception;

import org.entando.web.exception.ConflictException;

public class ConnectionAlreadyExistsException extends ConflictException {

    public ConnectionAlreadyExistsException() {
        super("org.entando.error.connection.duplicate");
    }

}
