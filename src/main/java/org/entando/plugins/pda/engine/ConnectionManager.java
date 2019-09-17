package org.entando.plugins.pda.engine;

import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ConnectionManager {

    public Optional<Connection> getConnection(String id) {
        return Optional.empty();
    }

}
