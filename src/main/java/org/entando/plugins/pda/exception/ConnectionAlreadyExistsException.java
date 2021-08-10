package org.entando.plugins.pda.exception;

import org.entando.web.exception.ConflictException;

public class ConnectionAlreadyExistsException extends ConflictException {

    public static final String MESSAGE_KEY = "org.entando.error.connection.duplicate";

    public ConnectionAlreadyExistsException() {
        super(MESSAGE_KEY);
    }

    public ConnectionAlreadyExistsException(Throwable throwable) {
        super(MESSAGE_KEY, throwable);
    }

}
