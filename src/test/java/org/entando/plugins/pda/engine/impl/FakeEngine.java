package org.entando.plugins.pda.engine.impl;

import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.service.task.impl.FakeTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FakeEngine extends Engine {
    public static final String TYPE = "fake";

    @Autowired
    public FakeEngine(FakeTaskService taskService) {
        super(TYPE, taskService);
    }
}
