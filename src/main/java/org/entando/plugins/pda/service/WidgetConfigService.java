package org.entando.plugins.pda.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.WidgetConfig;
import org.entando.plugins.pda.dto.widget.WidgetConfigDto;
import org.entando.plugins.pda.widget.WidgetSchemaFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class WidgetConfigService {
    private final WidgetSchemaFactory widgetSchemaFactory;
    private final ConnectionService connectionService;

    @Autowired
    public WidgetConfigService(WidgetSchemaFactory widgetSchemaFactory, ConnectionService connectionService) {
        this.widgetSchemaFactory = widgetSchemaFactory;
        this.connectionService = connectionService;
    }

    public JsonNode getSchema(String type) {
        return widgetSchemaFactory.getSchema(type);
    }

    public WidgetConfig fromDto(WidgetConfigDto dto) {
        Connection connection = connectionService.get(dto.getConnection());

        return WidgetConfig.builder()
                .pageId(dto.getPageId())
                .frameId(dto.getFrameId())
                .connection(connection)
                .extraProperties(dto.getExtraProperties())
                .build();
    }
}
