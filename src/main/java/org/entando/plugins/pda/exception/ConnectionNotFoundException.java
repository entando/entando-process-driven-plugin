package org.entando.plugins.pda.exception;

import org.entando.web.exception.NotFoundException;

public class ConnectionNotFoundException extends NotFoundException {

    public ConnectionNotFoundException() {
        super("org.entando.error.connection.notFound");
    }

}
