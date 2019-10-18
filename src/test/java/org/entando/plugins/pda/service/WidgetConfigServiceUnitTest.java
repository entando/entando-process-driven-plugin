package org.entando.plugins.pda.service;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.entando.plugins.pda.core.model.WidgetConfig;
import org.entando.plugins.pda.dto.widget.WidgetConfigDto;
import org.entando.plugins.pda.util.ConnectionTestHelper;
import org.entando.plugins.pda.util.WidgetConfigTestHelper;
import org.entando.plugins.pda.widget.WidgetSchemaFactory;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.web.client.RestTemplate;

public class WidgetConfigServiceUnitTest {
    private WidgetConfigService widgetConfigService;

    private WidgetSchemaFactory widgetSchemaFactory;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before()
    public void setup() {
        widgetSchemaFactory = mock(WidgetSchemaFactory.class);

        ConnectionService connectionService = mock(ConnectionService.class);
        when(connectionService.get(any())).thenReturn(ConnectionTestHelper.createConnection());

        widgetConfigService = new WidgetConfigService(widgetSchemaFactory, connectionService);
    }

    @Test
    public void testGetSchema() {
        widgetConfigService.getSchema("type");

        verify(widgetSchemaFactory).getSchema("type");
    }

    @Test
    public void testConvertToDto() {
        WidgetConfigDto dto = WidgetConfigTestHelper.createWidgetConfigDto();
        WidgetConfig config = widgetConfigService.fromDto(dto);

        assertThat(config).isNotNull();
        assertThat(config.getConnection().getName()).isEqualTo(dto.getConnection());
        assertThat(config.getPageId()).isEqualTo(dto.getPageId());
        assertThat(config.getFrameId()).isEqualTo(dto.getFrameId());
        assertThat(config.getExtraProperties()).isEqualTo(dto.getExtraProperties());
    }
}
