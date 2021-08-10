package org.entando.plugins.pda.exception;

import org.entando.web.exception.NotFoundException;

public class ConnectionNotFoundException extends NotFoundException {

    public static final String MESSAGE_KEY = "org.entando.error.connection.notFound";

    public ConnectionNotFoundException() {
        super(MESSAGE_KEY);
    }

    public ConnectionNotFoundException(Throwable e) {
        super(MESSAGE_KEY, e);
    }
}
