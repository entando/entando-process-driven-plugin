package org.entando.plugins.pda.engine;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ConnectionManager {

    public Optional<Connection> getConnection(String id) {
        return Optional.empty();
    }

}
