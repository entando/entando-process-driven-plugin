package org.entando.plugins.pda.engine;

import java.util.List;
import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.exception.EngineNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EngineFactory {

    @Autowired
    private List<Engine> availableEngines;

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

    public void setAvailableEngines(List<Engine> availableEngines) {
        this.availableEngines = availableEngines;
    }
}
