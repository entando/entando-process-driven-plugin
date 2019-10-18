package org.entando.plugins.pda.dto.widget;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.entando.plugins.pda.core.model.WidgetConfig;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WidgetConfigDto {
    private String pageId;

    private String frameId;

    private String connection;

    @JsonAnySetter
    private Map<String,Object> extraProperties = new HashMap<>();

    @JsonAnyGetter
    public Map<String,Object> getExtraProperties() {
        return extraProperties;
    }

    public static WidgetConfigDto fromModel(WidgetConfig widgetConfig) {
        return WidgetConfigDto.builder()
                .pageId(widgetConfig.getPageId())
                .frameId(widgetConfig.getFrameId())
                .connection(widgetConfig.getConnection().getName())
                .extraProperties(widgetConfig.getExtraProperties())
                .build();
    }
}
