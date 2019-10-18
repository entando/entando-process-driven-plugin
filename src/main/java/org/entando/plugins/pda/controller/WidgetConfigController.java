package org.entando.plugins.pda.controller;

import static org.entando.plugins.pda.controller.AuthPermissions.WIDGET_CONFIG_SCHEMA;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.service.WidgetConfigService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Api(tags = "Configurations")
@RequestMapping(path = "/config")
@RequiredArgsConstructor
public class WidgetConfigController {

    private final @NonNull WidgetConfigService widgetConfigService;

    @Secured(WIDGET_CONFIG_SCHEMA)
    @ApiOperation(notes = "Gets a widget config schema", nickname = "getWidgetConfigSchema",
            value = "GET WidgetConfigSchema")
    @GetMapping(path = "/schema/{schemaType}", produces = { APPLICATION_JSON_VALUE })
    public JsonNode getSchema(@PathVariable String schemaType) {
        log.info("Requesting widget config schema {}", schemaType);
        return widgetConfigService.getSchema(schemaType);
    }

}
