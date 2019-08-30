package org.entando.plugins.pda.engine;

import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.exception.EngineNotFoundException;
import org.entando.plugins.pda.pam.engine.KieEngine;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class EngineFactory implements ApplicationContextAware  {
    private Map<String, Engine> availableEngines = new HashMap<>();

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        availableEngines.put(KieEngine.TYPE, applicationContext.getBean(KieEngine.class));
    }

    public Engine getEngine(String type) {
        return Optional.ofNullable(availableEngines.get(type))
                .orElseThrow(EngineNotFoundException::new);
    }

    public void validateEngine(String type) {
        getEngine(type);
    }
}
