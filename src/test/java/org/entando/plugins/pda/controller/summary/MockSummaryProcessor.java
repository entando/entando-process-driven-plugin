package org.entando.plugins.pda.controller.summary;

import org.entando.plugins.pda.core.engine.Connection;
import org.entando.plugins.pda.core.model.summary.Summary;
import org.entando.plugins.pda.core.service.summary.DataTypeService;
import org.entando.plugins.pda.core.service.summary.processor.AbstractSummaryProcessor;
import org.springframework.stereotype.Component;

@Component
public class MockSummaryProcessor extends AbstractSummaryProcessor {
    public static final String TYPE = "MockDataType";

    protected MockSummaryProcessor(DataTypeService dataTypeService) {
        super(TYPE, dataTypeService);
    }

    @Override
    public Summary getSummary(Connection connection, String request) {
        return MockSummary.builder().myField(request).build();
    }
}
