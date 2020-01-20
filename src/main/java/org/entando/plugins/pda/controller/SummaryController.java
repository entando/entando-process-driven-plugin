package org.entando.plugins.pda.controller;

import static org.entando.plugins.pda.controller.AuthPermissions.SUMMARY_GET;
import static org.entando.plugins.pda.controller.AuthPermissions.SUMMARY_LIST;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.ws.rs.QueryParam;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.summary.FrequencyEnum;
import org.entando.plugins.pda.core.model.summary.Summary;
import org.entando.plugins.pda.core.model.summary.SummaryType;
import org.entando.plugins.pda.core.service.summary.SummaryService;
import org.entando.plugins.pda.service.ConnectionService;
import org.entando.web.response.SimpleRestResponse;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "Summary")
@RequestMapping(path = "/connections/{connId}/summaries")
@RequiredArgsConstructor
public class SummaryController {

    private final ConnectionService connectionService;
    private final SummaryService summaryService;

    @Secured(SUMMARY_LIST)
    @ApiOperation(notes = "Lists all summary types for a given connection", nickname = "listSummaryTypes",
            value = "LIST SummaryType")
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<List<SummaryType>> listSummaryTypes(@PathVariable String connId) {
        Connection connection = connectionService.get(connId);
        return new SimpleRestResponse<>(summaryService.getSummaryTypesByEngine(connection.getEngine()));
    }

    @Secured(SUMMARY_GET)
    @ApiOperation(notes = "Gets a summary", nickname = "getSummaryById", value = "GET Summary")
    @GetMapping(value = "/{summaryId}", produces = APPLICATION_JSON_VALUE)
    public SimpleRestResponse<Summary> getSummaryById(@PathVariable String connId, @PathVariable String summaryId,
            @QueryParam("frequency") String frequency) {
        FrequencyEnum frequencyEnum =
                StringUtils.isEmpty(frequency) ? FrequencyEnum.MONTHLY : FrequencyEnum.valueOf(frequency.toUpperCase());
        Connection connection = connectionService.get(connId);
        return new SimpleRestResponse<>(summaryService.calculateSummary(connection, summaryId, frequencyEnum));
    }
}
