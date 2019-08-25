package org.entando.plugins.pda.controller;

import io.swagger.annotations.Api;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.service.TaskService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Tasks")
@RequestMapping(path = "/tasks")
@RequiredArgsConstructor
public class TasksController {

    private final @NonNull
    TaskService taskService;

}
