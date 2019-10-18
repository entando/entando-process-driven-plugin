package org.entando.plugins.pda.widget.model;

import java.util.List;
import java.util.Map;
import lombok.Data;
import org.entando.plugins.pda.dto.widget.WidgetConfigDto;

@Data
public class TaskListWidgetConfig extends WidgetConfigDto {

    private String processInstanceId;

    private Boolean newPageOnClick;

    private Boolean showClaimButton;

    private Boolean showCompleteButton;

    private List<String> groups;

    private List<WidgetTableColumn> columns;

    public TaskListWidgetConfig(String pageId, String frameId, String connection,
            Map<String, Object> extraProperties) {
        super(pageId, frameId, connection, extraProperties);
    }
}
