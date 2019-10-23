package org.entando.plugins.pda.engine;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.exception.EngineNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EngineFactory {

    private final List<Engine> availableEngines;

    public Engine getEngine(String type) {
        for (Engine engine : availableEngines) {
            if (engine.getType().equals(type)) {
                return engine;
            }
        }
        throw new EngineNotFoundException();
    }

    public void validateEngine(String type) {
        getEngine(type);
    }
}
