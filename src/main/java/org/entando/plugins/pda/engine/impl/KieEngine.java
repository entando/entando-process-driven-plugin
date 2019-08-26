package org.entando.plugins.pda.engine.impl;

import org.entando.plugins.pda.engine.Engine;
import org.entando.plugins.pda.service.task.impl.KieTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KieEngine extends Engine {

    @Autowired
    public KieEngine(KieTaskService taskService) {
        super(taskService);
    }
}
