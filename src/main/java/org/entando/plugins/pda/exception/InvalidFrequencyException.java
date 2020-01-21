package org.entando.plugins.pda.exception;

import org.entando.web.exception.HttpException;
import org.springframework.http.HttpStatus;

public class InvalidFrequencyException extends HttpException {

    public InvalidFrequencyException(Throwable throwable) {
        super(HttpStatus.BAD_REQUEST, "org.entando.error.frequency.invalid", throwable);
    }
}
