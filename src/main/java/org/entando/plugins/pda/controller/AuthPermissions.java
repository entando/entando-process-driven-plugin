package org.entando.plugins.pda.controller;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AuthPermissions {

    public static final String TASK_LIST = "task-list";
    public static final String TASK_GET = "task-get";

    public static final String TASK_CLAIM = "task-claim";
    public static final String TASK_UNCLAIM = "task-unclaim";
    public static final String TASK_ASSIGN = "task-assign";
    public static final String TASK_START = "task-start";
    public static final String TASK_PAUSE = "task-pause";
    public static final String TASK_RESUME = "task-resume";
    public static final String TASK_COMPLETE = "task-complete";

    public static final String TASK_DEFINITION_COLUMNS_LIST = "task-definition-columns-list";

    public static final String TASK_COMMENTS_LIST = "task-comments-list";
    public static final String TASK_COMMENTS_GET = "task-comments-get";
    public static final String TASK_COMMENTS_CREATE = "task-comments-create";
    public static final String TASK_COMMENTS_DELETE = "task-comments-delete";

    public static final String TASK_ATTACHMENTS_LIST = "task-attachments-list";
    public static final String TASK_ATTACHMENTS_GET = "task-attachments-get";
    public static final String TASK_ATTACHMENTS_CREATE = "task-attachments-create";
    public static final String TASK_ATTACHMENTS_DELETE = "task-attachments-delete";
    public static final String TASK_ATTACHMENTS_DOWNLOAD = "task-attachments-download";

    public static final String TASK_FORM_GET = "task-form-get";
    public static final String TASK_FORM_SUBMIT = "task-form-submit";

    public static final String CONNECTION_LIST = "connection-list";
    public static final String CONNECTION_GET = "connection-get";
    public static final String CONNECTION_CREATE = "connection-create";
    public static final String CONNECTION_EDIT = "connection-edit";
    public static final String CONNECTION_DELETE = "connection-delete";
    public static final String CONNECTION_TEST = "connection-test";

    public static final String PROCESS_DEFINITION_LIST = "process-definition-list";
    public static final String PROCESS_DIAGRAM = "process-diagram";

    public static final String PROCESS_DEFINITION_FORM_GET = "process-definition-form-get";
    public static final String PROCESS_DEFINITION_FORM_SUBMIT = "process-definition-form-submit";

    public static final String GROUP_LIST = "group-list";

    public static final String SUMMARY_DATA_REPOSITORY_LIST = "summary-data-repository-list";
    public static final String SUMMARY_TYPE_LIST = "summary-type-list";
    public static final String SUMMARY_GET = "summary-get";
}
