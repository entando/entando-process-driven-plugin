package org.entando.plugins.pda.controller.summary;

import static org.entando.plugins.pda.controller.AuthPermissions.SUMMARY_DATA_TYPE_LIST;
import static org.entando.plugins.pda.controller.AuthPermissions.SUMMARY_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.SUMMARY_TYPE_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.summary.Summary;
import org.entando.plugins.pda.core.service.summary.DataType;
import org.entando.plugins.pda.core.service.summary.DataTypeService;
import org.entando.plugins.pda.core.service.summary.SummaryService;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "Summary")
@RequestMapping(path = "/connections/{connId}/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final ConnectionService connectionService;
    private final SummaryService summaryService;
    private final DataTypeService dataTypeService;

    @Secured(SUMMARY_DATA_TYPE_LIST)
    @ApiOperation(notes = "Lists all Summary Data Types for a Connection",
            nickname = "listSummaryDataTypes", value = "LIST DataType")
    @GetMapping(value = "/dataTypes", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<String>> listSummaryDataTypes(@PathVariable String connId) {
        Connection connection = connectionService.get(connId);
        return new SimpleRestResponse<>(dataTypeService
                .listDataTypes(connection.getEngine())
                .stream()
                .map(DataType::getId)
                .collect(Collectors.toList()));
    }

    @Secured(SUMMARY_TYPE_LIST)
    @ApiOperation(notes = "Lists all Summary Types for a given connection", nickname = "listSummaryTypes",
            value = "LIST SummaryType")
    @GetMapping(value = "/summaryTypes", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<String>> listSummaryTypes(@PathVariable String connId) {
        return new SimpleRestResponse<>(summaryService.listSummaryTypes());
    }

    @Secured(SUMMARY_GET)
    @ApiOperation(notes = "Gets the calculated Summary",
            nickname = "calculateSummary", value = "GET Summary")
    @PostMapping(value = "/summaryTypes/{summaryType}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Summary> calculateSummary(@PathVariable String connId, @PathVariable String summaryType,
            @RequestBody String request) {
        Connection connection = connectionService.get(connId);
        return new SimpleRestResponse<>(summaryService.getSummaryProcessor(summaryType)
                .getSummary(connection, request));
    }
}
