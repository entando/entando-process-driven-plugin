package org.entando.plugins.pda.controller.summary;

import lombok.Builder;
import lombok.Data;
import org.entando.plugins.pda.core.model.summary.Summary;

@Data
@Builder
public class MockSummary implements Summary {
    private String myField;
}
