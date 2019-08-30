package org.entando.plugins.pda.exception;

import org.entando.web.exception.NotFoundException;

public class ConnectionAlreadyExistsException extends NotFoundException {

    public ConnectionAlreadyExistsException() {
        super("org.entando.error.connection.duplicate");
    }

}
