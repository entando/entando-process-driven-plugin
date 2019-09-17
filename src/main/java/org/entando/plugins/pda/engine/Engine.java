package org.entando.plugins.pda.engine;

import java.util.Optional;
import lombok.AllArgsConstructor;
import org.entando.plugins.pda.service.task.TaskService;

@AllArgsConstructor
public abstract class Engine {
    protected TaskService taskService;

    public Optional<TaskService> getTaskService() {
        return Optional.ofNullable(taskService);
    }
}
