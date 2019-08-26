package org.entando.plugins.pda.engine;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.entando.plugins.pda.service.task.TaskService;

import java.util.Optional;

@AllArgsConstructor
public abstract class Engine {
    protected TaskService taskService;

    public Optional<TaskService> getTaskService() {
        return Optional.ofNullable(taskService);
    }
}
