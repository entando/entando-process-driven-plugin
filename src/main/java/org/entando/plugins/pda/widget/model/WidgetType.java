package org.entando.plugins.pda.widget.model;

public enum WidgetType {
    TASK_LIST("TaskList", TaskListWidgetConfig.class);

    final String code;
    final Class<Object> schema;

    @SuppressWarnings("unchecked")
    WidgetType(String code, Class schema) {
        this.code = code;
        this.schema = schema;
    }

    public String code() {
        return code;
    }

    public Class<Object> schema() {
        return schema;
    }
}
