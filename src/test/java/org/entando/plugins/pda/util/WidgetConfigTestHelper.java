package org.entando.plugins.pda.util;

import lombok.experimental.UtilityClass;
import org.entando.plugins.pda.core.model.WidgetConfig;
import org.entando.plugins.pda.dto.widget.WidgetConfigDto;

@UtilityClass
public class WidgetConfigTestHelper {
    public static final String PAGE_ID_1 = "1";
    public static final String FRAME_ID_1 = "1";
    public static final String EXTRA_PROPERTY_KEY_1 = "myKey1";
    public static final String EXTRA_PROPERTY_VALUE_1 = "myValue1";

    public WidgetConfigDto createWidgetConfigDto() {
        return WidgetConfigDto.fromModel(
                WidgetConfig.builder()
                        .pageId(PAGE_ID_1)
                        .frameId(FRAME_ID_1)
                        .connection(ConnectionTestHelper.createConnection())
                        .extraProperty(EXTRA_PROPERTY_KEY_1, EXTRA_PROPERTY_VALUE_1)
                        .build());
    }
}
