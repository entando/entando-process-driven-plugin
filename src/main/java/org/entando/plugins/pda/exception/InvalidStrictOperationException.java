package org.entando.plugins.pda.exception;

import org.entando.web.exception.UnprocessableEntityException;

public class InvalidStrictOperationException extends UnprocessableEntityException {

    public static final String MESSAGE_KEY = "org.entando.error.connection.strictLevel";

    public InvalidStrictOperationException() {
        super(MESSAGE_KEY);
    }
}
