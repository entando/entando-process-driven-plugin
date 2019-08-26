package org.entando.plugins.pda.engine.impl;

import org.entando.plugins.pda.engine.Engine;
import org.entando.plugins.pda.service.task.impl.FakeTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FakeEngine extends Engine {

    @Autowired

    public FakeEngine(FakeTaskService taskService) {
        super(taskService);
    }
}
